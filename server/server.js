require('dotenv').config()

const express = require('express')
const detailRoutes = require('./routes/details')

// start the express application (invoke from package)
const app = express()


// middleware
app.use((req, res, next) => {
    console.log(req.path, req.method)
    // call next otherwise app cant move on 
    next()
})

// add routing - calling to detail.js 
app.use('/api/details', detailRoutes)

// request listener + dotnet package - process.env
app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})

