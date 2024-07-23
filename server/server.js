require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const detailRoutes = require('./routes/details');
const userRoutes = require('./routes/user');
const path = require('path')
const cors = require('cors');


const app = express();

app.use(cors());


// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use('/api/details', detailRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to db');
        app.listen(PORT, () => {
            console.log('Listening on port', PORT);
        });
    })
    .catch((error) => {
        console.log('Error connecting to the database:', error);
    });
