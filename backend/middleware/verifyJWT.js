require('dotenv').config();
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');

function verifyJWT(req, res, next) {
  try {
    // Get auth header value
    // FORMAT OF TOKEN
    // Authorization: Bearer <accss_token>
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) throw new CustomError(401, 'No JWT');

    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearToken = bearer[1];

    const { JWT_SECRET_KEY } = process.env;

    jwt.verify(bearToken, JWT_SECRET_KEY, function (err, decodedToken) {
      if (err) {
        throw new CustomError(403, err.name);
      } else {
        // Extract user information from the decoded token
        const currentUser = decodedToken.user;

        // Assign the currentUser to res.locals or req.locals
        // to make it available in subsequent middleware or routes
        res.locals.currentUser = currentUser;
        next();
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { verifyJWT };
