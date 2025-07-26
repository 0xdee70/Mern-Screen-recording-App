const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');

// Middleware to verify access token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    const decoded = verifyAccessToken(token);
    
    // Find user and attach to request
    const user = await User.findOne({ email: decoded.email }).select('-password -refreshTokens');
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    req.tokenPayload = decoded;
    next();
  } catch (error) {
    if (error.message.includes('expired')) {
      return res.status(401).json({ 
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(403).json({ 
      message: 'Invalid access token',
      code: 'TOKEN_INVALID'
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findOne({ email: decoded.email }).select('-password -refreshTokens');
      if (user) {
        req.user = user;
        req.tokenPayload = decoded;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
};