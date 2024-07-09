const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const validator = require('validator')

const userSchema = new Schema ({
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

// static method used for additional password security
userSchema.statics.signup = async function (username, email, password) {


    // signup form field validation
    if (!username || !email || !password) {
        throw Error('All fields are required')
    }

    // form validator package validation
    if (!validator.isLength(username,  { min: 4, max: 30 })) {
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
        throw Error('Email already in use')
    }

    // execute bcrypt functions if email valid
    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt(10)
    // Hash the password with the generated salt
    const hash = await bcrypt.hash(password, salt)
    // Create a new user with the provided email and hashed password
    const user = await this.create({ username, email, password: hash })

    return user
}

module.exports = mongoose.model('User', userSchema)
