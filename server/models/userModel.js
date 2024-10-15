const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

})

// static signup method 
userSchema.statics.signup = async function (username, email, password) {

    // signup form field validation - custom 
    if (!username || !email || !password) {
        throw Error('All fields are required')
    }

    // form validator package validation - package func
    if (!validator.isLength(username, { min: 4, max: 30 })) {
        throw Error('Username is not valid. It should be 4-30 characters')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is too weak')
    }

    const exists = await this.findOne({ email })
    // throw error if already in use
    if (exists) {
        throw Error('A user with this email already exists')
    }

    // execute bcrypt functions if email valid
    // Generate a salt for hashing the password 
    const salt = await bcrypt.genSalt(14)
    // compute the hash 16384 times = 14
    const hash = await bcrypt.hash(password, salt)

    // Create a new user with the provided email and hashed password
    const user = await this.create({ username, email, password: hash })

    return user
}

// static login method
userSchema.statics.login = async function (username, email, password) {

    // login form field validation
    if (!username || !email || !password) {
        throw Error('All fields are required')
    }

    // check to see if email exist in database
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('Incorrect email')
    }

    // compare the entered pass with the hashed stored in db (bcrypt.compare) built in function
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    return user
}



module.exports = mongoose.model('User', userSchema)