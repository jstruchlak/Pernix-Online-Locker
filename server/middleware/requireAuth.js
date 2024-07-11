const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {

    // verify the user is authenticated with a token
    // use built in function for auth from request.headers
    const { authorization } = req.headers

    // token will be stored in authorization - run an if check
    if(!authorization) {
        return res.status(400).json({error: 'Authorization token required'})
    }

    // token stored in authorization as a string seperated by a space (bearer head.pay.signature)
    const token = authorization.split(' ')[1]

    try {
        // returns id only from payload - verify the token and secret from .env
        const {_id} = jwt.verify(token, process.env.SECRET)

        // returns a smaller object of the id property
        req.user = await User.findOne({ _id }).select('_id')
        next()
        
    } catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not Authorized'})
    }
}

module.exports = requireAuth