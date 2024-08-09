const express = require('express');
const passport = require('passport');
const { createUser, findUserByUsername, addLoginAttempt, resetLoginAttempts  } = require('../models/User');
const { createAccount } = require('../models/Account')
const {checkAttempts} = require('../middlewares/authMiddleware')
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
    const account = await createAccount(newUser.id)
    res.status(201).json({ message: 'User registered successfully', user: newUser, account: account });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login',checkAttempts, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, async err => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      resetLoginAttempts(req.body.username)
      const userData = await findUserByUsername(req.body.username);
      const {id, username} = userData
      return res.status(200).json({ message: 'Logged in successfully', username, id });
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
