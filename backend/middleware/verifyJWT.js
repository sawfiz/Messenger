require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

function verifyJWT(req, res, next) {
  // Get auth header value
  // FORMAT OF TOKEN
  // Authorization: Bearer <accss_token>
  const bearerHeader = req.headers['authorization'];

  // Check if bearer is undefined
  if (typeof bearerHeader !== undefined) {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearToken = bearer[1];

    const { JWT_SECRET_KEY } = process.env;

    jwt.verify(bearToken, JWT_SECRET_KEY, function (err, decodedToken) {
      if (!err) {
        // Extract user information from the decoded token
        const currentUser = decodedToken.user;

        // Assign the currentUser to res.locals or req.locals to make it available in subsequent middleware or routes
        res.locals.currentUser = currentUser;
        console.log("verified");
        next();
      } else {
        throw new CustomError(403, err.name);
      }
    });
  }
}

module.exports = { verifyJWT };
