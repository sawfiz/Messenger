// Libraries
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const validateObjectId = require('../middleware/validateObjectId');
const { verifyJWT } = require('../middleware/verifyJWT');
const CustomError = require('../utils/CustomError');

// Seurity
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Model
const User = require('../models/user');

const validateInputs = () => {
  return [
    (req, res, next) => {
      console.log('POST received');
      next();
    },

    body('first_name')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage('First name must be specified')
      .matches(/^[a-zA-Z0-9 .-]*$/) // Allow space / . / - in firstname
      .withMessage('First name has non-alphanumeric characters'),
    body('last_name')
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage('Last name must be specified')
      .matches(/^[a-zA-Z0-9-]*$/) // Allow - in lastname
      .withMessage('First name has non-alphanumeric characters'),
    body('username')
      .trim()
      .isLength({ min: 4, max: 10 })
      .escape()
      .withMessage('Username must be between 4 to 8 characters.')
      .isAlphanumeric()
      .withMessage('First name has non-alphanumeric charecters.'),
    body('password1')
      .trim()
      .isLength({ min: 3 })
      .escape()
      .withMessage('Password must be at least 3 characters.'),
    // Validate and sanitize the 'mobile' field

    (req, res, next) => {
      console.log('Went through validations');
      next();
    },
  ];
};

// Handle GET all users.
exports.users_list = [
  verifyJWT,
  asyncHandler(async (req, res, next) => {
    const users_list = await User.find({}, '').sort({ username: 1 }).exec();
    res.status(200).json({ users_list });
  }),
];

// Handle GET details of a specific user.
exports.user_detail = [
  verifyJWT,
  validateObjectId,
  asyncHandler(async (req, res, next) => {
    const [user] = await User.findById(req.params.id).exec();

    if (user === null) {
      const err = new Error('user not found');
      err.status = 404;
      next(err);
    }

    res.status(200).json({ user });
  }),
];

// Handle POST to create an user
exports.user_create_post = [
  validateInputs(),
  asyncHandler(async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      throw new CustomError(400, JSON.stringify(validationErrors));
    }

    // Make sure username is not already used
    const userExists = await User.findOne({
      username: req.body.username,
    });
    if (userExists) throw new CustomError(409, 'Athlete already exists');

    bcrypt.hash(req.body.password1, 10, async (err, hashedPassword) => {
      if (err) throw new CustomError(400, 'Error hasing password');

      try {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          photoUrl: req.file ? req.file.path : null,
        });
        const result = await user.save();
        res.status(201).json({ message: 'Success' });
      } catch (err) {
        throw new CustomError(500, 'Erro saving user');
      }
    });
  }),
];

exports.user_update = [
  validateObjectId,
  verifyJWT,
  validateInputs(),
  asyncHandler(async (req, res, next) => {
    console.log('Validated');
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    try {
      bcrypt.hash(req.body.password1, 10, async (err, hashedPassword) => {
        if (err) {
          return next(new CustomError(400, 'Error hashing password'));
        }

        const userUpdates = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          photoUrl: req.file ? req.file.path : req.body.photoUrl,
        };

        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: userUpdates },
          { new: true } // Returns the modified document
        );

        if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({ message: 'Success!', user: updatedUser });
      });
    } catch (error) {
      console.log('Error:', error);
      return next(new CustomError(500, 'Server Error'));
    }
  }),
];

// Handle DELETE an user
exports.user_delete = [
  verifyJWT,
  (req, res, next) => {
    console.log('DELETE received');
    next();
  },
  validateObjectId,
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        await User.findByIdAndDelete(req.params.id);
        // res.status(200).json({ message: 'DELETE is success!' });
        // res.status(204).send();
        res.status(204).end();
      } else {
        console.log('Record does not exist!');
        throw new CustomError(500, 'Record does not exist.');
      }
    } catch (error) {
      console.log('Deletion failed');
      throw new CustomError(500, error);
    }
  }),
];
