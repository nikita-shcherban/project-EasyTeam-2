import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, beforeEach, test } from 'node:test';
import bcrypt from 'bcrypt';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { Types } from 'mongoose';
import authRoutes from '../src/routes/api/authRoutes.js';
import { authenticate } from '../src/middleware/authenticate.js';
import { errorHandler } from '../src/middlewares/errorHandler.js';
import { notFoundHandler } from '../src/middlewares/notFoundHandler.js';
import { User } from '../src/models/user.js';
import { Session } from '../src/models/session.js';

const phone = '+380991234567';
const password = 'Password123';
let user;
let sessions;
let server;
let baseUrl;

const matches = (document, filter) =>
  Object.entries(filter).every(([key, value]) =>
    String(document[key]) === String(value),
  );

before(async () => {
  user = new User({
    username: 'TestUser',
    phone,
    password: await bcrypt.hash(password, 4),
  });

  const app = express();
  app.use(express.json(), cookieParser(), authRoutes);
  app.get('/protected', authenticate, (req, res) => res.json(req.user));
  app.use(notFoundHandler, errors(), errorHandler);
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections();
  });
});

beforeEach((t) => {
  sessions = [];
  t.mock.method(console, 'error', () => {});
  t.mock.method(User, 'findOne', (filter) => ({
    select: async (selection) => {
      assert.equal(selection, '+password');
      return matches(user, filter) ? user : null;
    },
  }));
  t.mock.method(User, 'findById', async (id) =>
    String(id) === String(user._id) ? user : null,
  );
  t.mock.method(Session, 'findOne', async (filter) =>
    sessions.find((session) => matches(session, filter)) ?? null,
  );
  t.mock.method(Session, 'create', async (data) => {
    const session = new Session(data);
    sessions.push(session);
    return session;
  });
  t.mock.method(Session, 'deleteMany', async (filter) => {
    const before = sessions.length;
    sessions = sessions.filter((session) => !matches(session, filter));
    return { deletedCount: before - sessions.length };
  });
  t.mock.method(Session, 'deleteOne', async (filter) => {
    const index = sessions.findIndex((session) => matches(session, filter));
    if (index === -1) return { deletedCount: 0 };
    sessions.splice(index, 1);
    return { deletedCount: 1 };
  });
});

const request = (path, { body, cookie, method = 'POST' } = {}) =>
  fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const login = (path = '/auth/login') =>
  request(path, { body: { phone, password } });

const cookies = (response) => response.headers.getSetCookie()
  .map((cookie) => cookie.split(';')[0]).join('; ');

const expectError = async (response, status, message) => {
  assert.equal(response.status, status);
  assert.deepEqual(await response.json(), { message });
};

test('login returns a user without password, replaces old sessions and sets cookies', async () => {
  await login();
  const oldSession = sessions[0];
  const response = await login();
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.phone, phone);
  assert.equal(body._id, String(user._id));
  assert.equal(Object.hasOwn(body, 'password'), false);
  assert.equal(sessions.length, 1);
  assert.notEqual(sessions[0].accessToken, oldSession.accessToken);
  const setCookies = response.headers.getSetCookie();
  assert.equal(setCookies.length, 3);
  for (const name of ['accessToken', 'refreshToken', 'sessionId']) {
    const cookie = setCookies.find((value) => value.startsWith(`${name}=`));
    assert.ok(cookie);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=None/);
  }
  await expectError(await request('/protected', {
    method: 'GET', cookie: `accessToken=${oldSession.accessToken}`,
  }), 401, 'Session not found');
});

test('unknown phone and incorrect password return the same 401 without deleting sessions', async () => {
  await login();
  for (const body of [
    { phone: '+380991234568', password },
    { phone, password: 'incorrect' },
  ]) {
    await expectError(await request('/auth/login', { body }), 401, 'Invalid credentials');
    assert.equal(sessions.length, 1);
  }
});

test('login rejects missing, malformed, non-string and email-only credentials', async () => {
  for (const body of [
    undefined, {}, { phone }, { password },
    { phone: 'invalid', password },
    { phone: 380991234567, password },
    { phone, password: 12345678 },
    { phone, password: '' },
    { phone: { $ne: null }, password },
    { email: 'user@example.com', password },
  ]) {
    assert.equal((await request('/auth/login', { body })).status, 400);
  }
  assert.equal(User.findOne.mock.callCount(), 0);
});

test('refresh rotates cookies and tokens and prevents reuse of old credentials', async () => {
  const initial = await login();
  const oldSession = sessions[0];
  const response = await request('/auth/refresh', { cookie: cookies(initial) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: 'Session refreshed' });
  assert.equal(response.headers.getSetCookie().length, 3);
  assert.equal(sessions.length, 1);
  assert.notEqual(sessions[0].accessToken, oldSession.accessToken);
  assert.notEqual(sessions[0].refreshToken, oldSession.refreshToken);
  assert.notEqual(String(sessions[0]._id), String(oldSession._id));
  await expectError(await request('/auth/refresh', { cookie: cookies(initial) }), 401, 'Session not found');
  const protectedResponse = await request('/protected', {
    method: 'GET', cookie: cookies(response),
  });
  assert.equal(protectedResponse.status, 200);
});

test('refresh rejects missing, malformed and mismatched cookies', async () => {
  await login();
  const session = sessions[0];
  for (const cookie of [
    undefined,
    `sessionId=${session._id}`,
    `refreshToken=${session.refreshToken}`,
    `sessionId=invalid; refreshToken=${session.refreshToken}`,
    `sessionId=${session._id}; refreshToken=wrong`,
    `sessionId=${new Types.ObjectId()}; refreshToken=${session.refreshToken}`,
  ]) {
    await expectError(await request('/auth/refresh', { cookie }), 401, 'Session not found');
  }
  assert.equal(sessions.length, 1);
});

test('refresh rejects expired tokens and tokens already consumed by another request', async (t) => {
  const initial = await login();
  sessions[0].refreshTokenValidUntil = new Date(0);
  await expectError(await request('/auth/refresh', { cookie: cookies(initial) }), 401, 'Session token expired');
  sessions[0].refreshTokenValidUntil = new Date(Date.now() + 60000);
  t.mock.method(Session, 'deleteOne', async () => ({ deletedCount: 0 }));
  await expectError(await request('/auth/refresh', { cookie: cookies(initial) }), 401, 'Session not found');
  assert.equal(Session.create.mock.callCount(), 1);
});

test('logout removes its session without an access token and always clears cookies', async () => {
  await login();
  const sessionId = sessions[0]._id;
  for (const cookie of [`sessionId=${sessionId}`, undefined, 'sessionId=invalid']) {
    const response = await request('/auth/logout', { cookie });
    assert.equal(response.status, 204);
    assert.equal(await response.text(), '');
    assert.equal(sessions.length, 0);
    const cleared = response.headers.getSetCookie();
    assert.equal(cleared.length, 3);
    for (const name of ['sessionId', 'accessToken', 'refreshToken']) {
      const value = cleared.find((item) => item.startsWith(`${name}=`));
      assert.match(value, /Expires=Thu, 01 Jan 1970/);
      assert.match(value, /Path=\//);
      assert.match(value, /HttpOnly; Secure; SameSite=None/);
    }
  }
});

test('authenticate checks access token, expiry and user, without requiring sessionId', async () => {
  const protectedRequest = (cookie) => request('/protected', { method: 'GET', cookie });
  await expectError(await protectedRequest(), 401, 'Missing access token');
  await expectError(await protectedRequest('accessToken=unknown'), 401, 'Session not found');
  await login();
  const session = sessions[0];
  const cookie = `accessToken=${session.accessToken}`;
  const response = await protectedRequest(cookie);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).phone, phone);
  session.accessTokenValidUntil = new Date(0);
  await expectError(await protectedRequest(cookie), 401, 'Access token expired');
  session.accessTokenValidUntil = new Date(Date.now() + 60000);
  session.userId = new Types.ObjectId();
  await expectError(await protectedRequest(cookie), 401, 'Unauthorized');
});

test('existing /api/auth paths support the same login, refresh and logout flow', async () => {
  const initial = await login('/api/auth/login');
  assert.equal(initial.status, 200);
  const refreshed = await request('/api/auth/refresh', { cookie: cookies(initial) });
  assert.equal(refreshed.status, 200);
  const loggedOut = await request('/api/auth/logout', { cookie: cookies(refreshed) });
  assert.equal(loggedOut.status, 204);
  assert.equal(sessions.length, 0);
});

test('unknown routes return 404 and database failures reach the 500 handler', async (t) => {
  await expectError(await request('/does-not-exist'), 404, 'Route not found');
  t.mock.method(User, 'findOne', () => {
    throw new Error('Database unavailable');
  });
  assert.equal((await login()).status, 500);
  assert.equal(Session.create.mock.callCount(), 0);
});
