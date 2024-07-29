const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pernix Online Locker API Documentation',
            version: '1.0.0',
            description: 'API Routes - Paste JWT token in "Authorize" button → → → → →'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: 'https://pernix-api-locker.azurewebsites.net', 
            }
        ],
    },
    apis: ['./routes/*.js', './swagger/swaggerDocumentation.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
