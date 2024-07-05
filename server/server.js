require('dotenv').config()

const express = require('express')

// start the express application (invoke from package)
const app = express()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    // call next otherwise app cant move on 
    next()
})

// add routing
app.get('/', (req, res) => {
    res.json({mssg: 'Welcome to the Pernix Locker'})
})

// request listener + dotnet package - process.env
app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})

