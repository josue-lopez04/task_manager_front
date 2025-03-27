// backend/middleware/authentication.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Verificar si hay un header de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Authentication invalid' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token con la clave secreta
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      
      // Añadir los datos del usuario a la solicitud
      req.user = {
        userId: payload.userId,
        username: payload.username,
        role: payload.role, // Asegura que el rol se incluya
      };
      
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ msg: 'Authentication invalid' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ msg: 'Server error' });
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