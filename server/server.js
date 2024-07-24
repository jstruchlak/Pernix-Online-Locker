require('dotenv').config()
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const detailRoutes = require('./routes/details')
const userRoutes = require('./routes/user')
const path = require('path')

// start the express application (invoke from package)
const app = express()

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));


// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    // call next otherwise app crash 
    next()
})

// add routing - calling to detail.js 
app.use('/api/details', detailRoutes)
app.use('/api/user', userRoutes)

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

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
