const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Modle
const User = require('../models/user');
const { JWT_SECRET_KEY } = process.env;

// These function will be called when we use the passport.authenticate() function
function configPassport() {
  // Configure Local Strategy for user login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
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

  // JWT Strategy for token-based authentication
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET_KEY, // Replace with your actual JWT secret key
  };

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ id: jwtPayload.sub });
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
      // You can implement logic to verify the JWT and find the user based on the payload
    })
  );

  // Function to create a cookie
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Function to decode a cookie
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = configPassport;
