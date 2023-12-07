// Libraries
const asyncHandler = require('express-async-handler');
// const { body, validationResult } = require('express-validator');

// const validateObjectId = require('../middleware/validateObjectId');
// const { verifyJWT } = require('../middleware/verifyJWT');
const CustomError = require('../utils/CustomError');

// Model
const Message = require('../models/message');

// Handle POST to create an message
exports.message_create_post = [
  (req, res, next) => {
    console.log('POST received');
    console.log(req.body);
    next();
  },
  // verifyJWT,
  // validateInputs(),

  asyncHandler(async (req, res, next) => {
    // const validationErrors = validationResult(req);

    // if (!validationErrors.isEmpty()) {
    //   throw new CustomError(400, JSON.stringify(validationErrors));
    // }

    const message = new Message({
      text: req.body.text,
      date: req.body.date,
    });
    await message.save();
    res.status(201).json({ message: 'Success' });
  }),
];
