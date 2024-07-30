const express = require('express');
const passport = require('passport');
const { createUser, findUserByUsername } = require('../models/Users');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body)
  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await createUser(username, password, email);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, err => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      return res.status(200).json({ message: 'Logged in successfully' });
    });
  })(req, res, next);
});

// Logout Route
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
