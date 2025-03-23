import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const options = {
  swaggerDefinition: {
    info: {
      title: 'NodePop API',
      version: '0.1',
      description: 'API de NodePop',
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        // scheme: 'bearer',
        // bearerFormat: 'JWT',
        description: 'JWT Authorization header. Example: "Authorization: {token}"'
      },
    },
    security: [{ bearerAuth: [] }]
},
  // apis: ['swagger.yml']
  apis: ['./controllers/**/*.js']
}

const especification = swaggerJSDoc(options);

export default [swaggerUI.serve, swaggerUI.setup(especification)]