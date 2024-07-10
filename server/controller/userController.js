const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// genrate a token _id = part of the payload
const createToken = (_id) => {
// invalidate token in 1hr
return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1h'} )
}
// login user
const loginUser = async (req, res) => {
    const { username, email, password } = req.body

    try {
      const user = await User.login(username, email, password)
  
      // invoke createToken function with user and id in payload
      const token = createToken(user._id)
  
      res.status(200).json({ email, token })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
}




// signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const user = await User.signup(username, email, password)

    // invoke createToken function with user and id in payload
    const token = createToken(user._id)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }

}

module.exports = {signupUser, loginUser}