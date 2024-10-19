const express = require('express')
const { signupUser, loginUser, forgotPassword, resetPassword } = require('../controller/userController')

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// forgot password route
router.post('/forgot-password', forgotPassword); 

// reset password route
router.post('/reset-password', resetPassword); 

module.exports = router