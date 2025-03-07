// File: backend/middleware/authentication.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authentication invalid' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to request
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ msg: 'Authentication invalid' });
  }
};

// Admin middleware to check if user is admin
const adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied, admins only' });
  }
  next();
};

module.exports = { auth, adminOnly };