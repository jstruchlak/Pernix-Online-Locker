require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const detailRoutes = require('./routes/details');
const userRoutes = require('./routes/user');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swagger/swaggerConfig');

// Start the express application
const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Swagger UI
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// Routing
app.use('/api/details', detailRoutes);
app.use('/api/user', userRoutes);

// Connect to the MongoDB database
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('Connected to db');
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
};

// Start the server
const startServer = async () => {
    try {
        await connectToDatabase();
        const port = process.env.PORT || 4000; 
        const server = app.listen(port, async () => {
            console.log('Listening on port', port);

            const open = (await import('open')).default;
            open(`http://localhost:${port}/api-docs`);
        });

        return server; 
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
