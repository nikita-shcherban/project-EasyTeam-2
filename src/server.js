import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectMongoDB } from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errors } from 'celebrate';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerDocs } from './swagger/swagger.js';
import swaggerUI from 'swagger-ui-express';
// import feedbackRoutes from './routes/api/feedbackRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(notFoundHandler);
app.use(errors);
app.use(errorHandler);
// app.use(feedbackRoutes);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
