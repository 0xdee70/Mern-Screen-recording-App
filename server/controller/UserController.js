const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateTokenPair, verifyRefreshToken } = require('../config/jwt');

const RegisterUser = async (request, response) => {
  const { username, email, password } = request.body;
  try {
    // Validate input
    if (!username || !email || !password) {
      return response.status(400).json({ 
        message: "All fields are required" 
      });
    }

    if (password.length < 6) {
      return response.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    const securePassword = await bcrypt.hash(password, 10);

    const userExist = await User.findOne({ email });

    if (userExist) {
      return response.status(422).json({ 
        message: "User already exists with this email" 
      });
    }

    const user = new User({
      username,
      email,
      password: securePassword,
    });

    await user.save();
    console.log("user registered successfully ");
    
    response.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    response.status(500).json({ 
      message: "Internal server error during registration" 
    });
  }
};

const LoginUser = async (request, response) => {
  const { email, password } = request.body;
  try {
    // Validate input
    if (!email || !password) {
      return response.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({ 
        message: "Invalid email or password" 
      });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return response.status(401).json({ 
        message: "Invalid email or password" 
      });
    }
    
    // Generate token pair
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.username
    };
    
    const { accessToken, refreshToken } = generateTokenPair(tokenPayload);
    
    // Save refresh token to user
    await user.addRefreshToken(refreshToken);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token as httpOnly cookie
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    response.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({ 
      message: "Internal server error during login" 
    });
  }
};

const RefreshToken = async (request, response) => {
  try {
    const { refreshToken } = request.cookies;
    
    if (!refreshToken) {
      return response.status(401).json({ 
        message: "Refresh token required",
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if refresh token exists
    const user = await User.findOne({ 
      email: decoded.email,
      'refreshTokens.token': refreshToken
    });
    
    if (!user) {
      return response.status(403).json({ 
        message: "Invalid refresh token",
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    // Generate new token pair
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.username
    };
    
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(tokenPayload);
    
    // Remove old refresh token and add new one
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(newRefreshToken);
    
    // Set new refresh token as httpOnly cookie
    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    response.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error.message.includes('expired')) {
      return response.status(401).json({ 
        message: "Refresh token expired",
        code: 'REFRESH_TOKEN_EXPIRED'
      });
    }
    
    response.status(403).json({ 
      message: "Invalid refresh token",
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
};

const LogoutUser = async (request, response) => {
  try {
    const { refreshToken } = request.cookies;
    
    if (refreshToken) {
      // Find user and remove refresh token
      const user = await User.findOne({ 'refreshTokens.token': refreshToken });
      if (user) {
        await user.removeRefreshToken(refreshToken);
      }
    }
    
    // Clear refresh token cookie
    response.clearCookie('refreshToken');
    
    response.status(200).json({ 
      message: "Logged out successfully" 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    response.status(500).json({ 
      message: "Internal server error during logout" 
    });
  }
};

const LogoutAllDevices = async (request, response) => {
  try {
    const user = request.user; // From auth middleware
    
    // Remove all refresh tokens
    await user.removeAllRefreshTokens();
    
    // Clear refresh token cookie
    response.clearCookie('refreshToken');
    
    response.status(200).json({ 
      message: "Logged out from all devices successfully" 
    });
    
  } catch (error) {
    console.error('Logout all devices error:', error);
    response.status(500).json({ 
      message: "Internal server error during logout" 
    });
  }
};

const GetUserProfile = async (request, response) => {
  try {
    const user = request.user; // From auth middleware
    
    response.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    response.status(500).json({ 
      message: "Internal server error" 
    });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  RefreshToken,
  LogoutUser,
  LogoutAllDevices,
  GetUserProfile
};