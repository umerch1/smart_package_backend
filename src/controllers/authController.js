const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const userResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  gender: user.gender,
  email: user.email
});

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;

    if (typeof firstName !== 'string' || firstName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'First name must be at least 2 characters' });
    }
    if (typeof lastName !== 'string' || lastName.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Last name must be at least 2 characters' });
    }
    if (!gender || !['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Gender must be Male or Female' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 8) {
      return res.status(400).json({ success: false, message: 'Password must be between 6-8 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      email: normalizedEmail, 
      password: hashedPassword,
      gender
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: userResponse(user), token: generateToken(user._id.toString()) }
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userResponse(user), token: generateToken(user._id.toString()) }
    });
  } catch (error) {
    return next(error);
  }
};

const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful',
    data: {}
  });
};

module.exports = { register, login, logout };
