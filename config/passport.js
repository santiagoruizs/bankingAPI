
const LocalStrategy = require('passport-local').Strategy;
const { findUserByUsername, comparePassword, findUserById, addLoginAttempt } = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await findUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          const {attempts} = await addLoginAttempt(username)
          return done(null, false, { message: `Incorrect password, ${3-attempts} attempts left` });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });2
};
