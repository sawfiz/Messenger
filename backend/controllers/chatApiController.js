// Libraries
const asyncHandler = require('express-async-handler');

const validateObjectId = require('../middleware/validateObjectId');
const CustomError = require('../utils/CustomError');

// Model
const Chat = require('../models/chat');

// Handle GET chats that the currentUser participates
exports.chats_list = [
  asyncHandler(async (req, res, next) => {
    const currentUser = res.locals.currentUser;
    const chats_list = await Chat.find({ buddies: currentUser._id }).exec();
    res.status(200).json({ chats_list });
  }),
];

// Handle GET details of a specific chat.
exports.chat_detail = [
  validateObjectId,
  asyncHandler(async (req, res, next) => {
    console.log('get chat info');
    const chat = await Chat.findById(req.params.id).populate().exec();

    if (chat === null) {
      const err = new Error('chat not found');
      err.status = 404;
      next(err);
    }

    res.status(200).json({ chat });
  }),
];

// Handle POST to create a chat
exports.chat_create_post = [
  asyncHandler(async (req, res, next) => {
    console.log(
      '🚀 ~ file: chatApiController.js:44 ~ asyncHandler ~ req.body:',
      req.body
    );
    console.log(
      '🚀 ~ file: chatApiController.js:44 ~ asyncHandler ~ req.file:',
      req.file
    );

    const buddies = JSON.parse(req.body.buddies);

    const existingChat = await Chat.findOne({ buddies }, '').exec();

    if (existingChat) {
      return res.status(201).json({ message: existingChat });
    }

    try {
      const chat = new Chat({
        name: req.body.name,
        customName: req.body.customName,
        buddies: buddies,
        groupChat: req.body.groupChat,
        photoUrl: req.file ? req.file.path : req.body.photoUrl,
      });
      const result = await chat.save();
      res.status(201).json({ message: result });
    } catch (err) {
      console.log(
        '🚀 ~ file: chatApiController.js:63 ~ asyncHandler ~ err:',
        err
      );
      throw new CustomError(500, 'Error saving chat');
    }
  }),
];

// Handle PACTCH a particular field of a a chat
exports.chat_patch = [
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    console.log("🚀 ~ file: chatApiController.js:80 ~ asyncHandler ~ id:", id)
    const updatedData = req.body;
    console.log("🚀 ~ file: chatApiController.js:82 ~ asyncHandler ~ updatedData:", updatedData)

    try {
      const result = await Chat.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!result) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      res.status(200).json(result); // Send the updated resource in the response
    } catch (error) {
      console.log(
        '🚀 ~ file: chatApiController.js:91 ~ asyncHandler ~ error:',
        error
      );
    }
  }),
];
