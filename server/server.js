require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const detailRoutes = require('./routes/details');
const userRoutes = require('./routes/user');
const path = require('path');
const port = process.env.PORT || 4000;

// Start the express application (invoke from package)
const app = express();

const corsOptions = {
    origin: 'https://pernixlocker.azurewebsites.net',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Add routing - calling to detail.js
app.use('/api/details', detailRoutes);
app.use('/api/user', userRoutes);

app.use(express.static(path.join(__dirname, 'client', 'build')));

// Handle React routing, return index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Connecting to our mongoose db (all db request = asynchronous)
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to db');
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
// Global Error Handling
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});