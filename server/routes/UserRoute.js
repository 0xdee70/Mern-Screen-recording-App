const express = require('express')
const {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  LogoutAllDevices,
  GetUserProfile
} = require('../controller/UserController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router()

// Public routes
router.post('/register', RegisterUser);
router.post('/login', LoginUser);
router.post('/refresh-token', RefreshToken);
router.post('/logout', LogoutUser);

// Protected routes
router.get('/profile', authenticateToken, GetUserProfile);
router.post('/logout-all', authenticateToken, LogoutAllDevices);

module.exports = router