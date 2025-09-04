const express = require('express');
const bcrypt = require('bcryptjs');
const { generateAdminToken } = require('../middleware/auth');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check credentials against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateAdminToken();

    res.json({
      message: 'Login successful',
      token,
      admin: {
        username: adminUsername,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Invalid role' });
    }

    res.json({
      valid: true,
      admin: {
        username: decoded.username,
        role: decoded.role
      }
    });

  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;
