// File: backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// backend/controllers/authController.js

// Register user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'Username already exists' });
    }
    
    // Verificar si el email ya existed
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: 'Email already in use' });
    }
    
    // Crear usuario
    const user = await User.create({ username, email, password });
    
    // Generar token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
    
    res.status(201).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
      msg: 'Registration successful'
    });
  } catch (error) {
    // Mejorar el mensaje de error para duplicados
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        msg: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    res.status(400).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    
    // Verificar contraseña
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    
    // Generar token incluyendo el rol del usuario
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME || '30d' }
    );
    
    // Responder con información del usuario y token
    res.status(200).json({
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  register,
  login,
};





