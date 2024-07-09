const express = require('express')
const { signupUser, loginUser } = require('../controller/userController')

const router = express.Router()

// POST req handlers
// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

module.exports = router