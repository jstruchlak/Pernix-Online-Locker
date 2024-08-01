const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const validator = require('validator')
const config = require('../config')


// Generate a token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1h' });
};

// Login user
const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.login(username, email, password);

    // Create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);

    // Create token
    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 587,
  secure: false,
  auth: {
    user: 'pernix.com.au',
    pass: 'rx#!3DA4?yfgYFcL'
  }
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log('Received request to reset password for email:', email);

  try {
    if (!email) {
      console.warn('No email provided in request body');
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('User not found:', email);
      return res.status(404).json({ error: 'User with this email does not exist' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    console.log('Reset token generated and saved for user:', email);

    const resetUrl = `${config.DEV_BASE_URL}/reset-password/${resetToken}`;

    console.log('Sending reset email to:', email);

    const mailOptions = {
      from: 'joeys@pernix.com.au',
      to: email,
      subject: 'Pernix Online Locker Password Reset',
      html: `<p>To reset your password, please click the link below:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error occurred:', error);
        return res.status(500).json({ error: 'Failed to send reset email' });
      }
      console.log('Message sent:', info.messageId);
      res.status(200).json({ message: 'Reset link sent to your email' });
    });
  } catch (error) {
    console.error('Error in forgotPassword function:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Find user with the reset token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Your session has expired' });
    }

    // Check if the password is provided and if it's strong enough
    if (password) {
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password is too weak' });
      }

      // Hash the password and update the user's record
      user.password = await bcrypt.hash(password, 14);
    } else {
      return res.status(400).json({ error: 'Password cannot be empty' });
    }

    // Clear reset token and expiration fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save updated user
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Error in resetPassword function:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = { signupUser, loginUser, forgotPassword, resetPassword };
