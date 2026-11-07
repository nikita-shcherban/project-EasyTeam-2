import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'EasyTeam Clothica API',
      description: 'API endpoints to Clothica Web Service',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Auth',
        description: 'User authentication endpoints',
      },
      {
        name: 'Users',
        description: 'Operations on the users endpoints',
      },
      {
        name: 'Categories',
        description: 'Operations on the categories',
      },
      {
        name: 'Goods',
        description: 'Operations on the goods',
      },
      {
        name: 'Orders',
        description: 'Operations on the orders',
      },
      {
        name: 'Feedbacks',
        description: 'Operations on the feedbacks',
      },
      {
        name: 'Subscriptions',
        description: 'Operations on the subscriptions',
      },
    ],
  },
  apis: ['src/**/*.js'],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
