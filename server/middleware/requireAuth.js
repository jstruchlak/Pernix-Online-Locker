const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  // Token will be stored in authorization - run an if check
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  // Token stored in authorization as a string separated by a space (bearer head.pay.signature)
  const token = authorization.split(' ')[1];
 
  console.log('Received jwt Token:', token);
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    console.log('Verified jwt ID:', _id);
    req.user = await User.findOne({ _id }).select('_id');
    next();
  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' });
  }
}
module.exports = requireAuth;