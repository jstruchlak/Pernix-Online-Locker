const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swaggerConfig');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

module.exports = router;