const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

function configPassport() {
  // This function will be called when we use the passport.authenticate() function
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        console.log("🚀 ~ file: configPassport.js:12 ~ newLocalStrategy ~ user:", user)
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Function to create a cookie
  passport.serializeUser((user, done) => {
    console.log("🚀 ~ file: configPassport.js:29 ~ passport.serializeUser ~ user:", user)
    done(null, user.id);
  });

  // Function to decode a cookie
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      console.log("🚀 ~ file: configPassport.js:36 ~ passport.deserializeUser ~ user:", user)
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = configPassport;
