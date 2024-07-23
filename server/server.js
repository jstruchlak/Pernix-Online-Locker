require('dotenv').config()
const cors = require('cors'); 
const express = require('express')
const mongoose = require('mongoose')
const detailRoutes = require('./routes/details')
const userRoutes = require('./routes/user')

// start the express application (invoke from package)
const app = express()

// middleware
app.use(cors({
    origin: 'https://pernixlocker.azurewebsites.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    // call next otherwise app crash 
    next()
})

// add routing - calling to detail.js 
app.use('/api/details', detailRoutes)
app.use('/api/user', userRoutes)

// connecting to our mongoose db (all db request = asynschronis
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to db')
        app.listen(process.env.PORT, () => {
            console.log('Listening on port', process.env.PORT,)
        })

    })
    .catch((error) => {
        console.log(error)
    })


