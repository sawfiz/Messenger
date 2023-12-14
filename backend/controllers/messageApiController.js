// Libraries
const asyncHandler = require('express-async-handler');
// const { body, validationResult } = require('express-validator');

// const validateObjectId = require('../middleware/validateObjectId');
const { verifyJWT } = require('../middleware/verifyJWT');
const CustomError = require('../utils/CustomError');

// Model
const Message = require('../models/message');

// Handle GET all messages.
exports.messages_list = [
  verifyJWT,
  asyncHandler(async (req, res, next) => {
    const chatId = req.query.chatId;
    const messages_list = await Message.find({ chatId })
      .populate()
      .sort({ date: 1 })
      .exec();

    res.status(200).json({ messages_list });
  }),
];

// Handle GET all messages.
exports.latest_message = [
  verifyJWT,
  asyncHandler(async (req, res, next) => {
    console.log("fetching the latest message");
    const chatId = req.query.chatId;
    const messages_list = await Message.find({ chatId })
      .populate()
      .sort({ date: -1 })
      .limit(1)
      .exec();

    res.status(200).json({ messages_list });
  }),
];

// Handle POST to create an message
exports.message_create_post = [
  verifyJWT,
  (req, res, next) => {
    console.log('POST received');
    console.log(req.body);
    console.log(req.body);
    console.log(req.file);
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
      sender: req.body.sender,
      chatId: req.body.chatId,
      text: req.body.text,
      date: req.body.date,
      attachmentUrl: req.file ? req.file.path : null,
    });
    await message.save();
    res.status(201).json({ message: 'Success' });
  }),
];
