require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const detailRoutes = require('./routes/details')
const userRoutes = require('./routes/user')
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swagger/swaggerConfig');


// start the express application
const app = express()

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// Swagger UI
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// routing
app.use('/api/details', detailRoutes);
app.use('/api/user', userRoutes);

// connecting to our mongoose db (all db request = asynschronis
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to db')
        app.listen(process.env.PORT, async () => {
            console.log('Listening on port', process.env.PORT)

            const open = (await import('open')).default;
            // swagger UI 
            open(`http://localhost:${process.env.PORT}/api-docs`);
        })
    })
    .catch((error) => {
        console.log(error)
    })