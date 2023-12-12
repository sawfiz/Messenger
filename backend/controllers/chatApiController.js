// Libraries
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const validateObjectId = require('../middleware/validateObjectId');
// const { verifyJWT } = require('../middleware/verifyJWT');
const CustomError = require('../utils/CustomError');

// Model
const Chat = require('../models/chat');

// Handle GET chats that the currentUser participates
exports.chats_list = [
  // verifyJWT,
  asyncHandler(async (req, res, next) => {
    const currentUser = res.locals.currentUser;
    const chats_list = await Chat.find({buddies: currentUser._id}).exec();
    res.status(200).json({ chats_list });
  }),
];

// Handle GET details of a specific chat.
exports.chat_detail = [
  // verifyJWT,
  validateObjectId,
  asyncHandler(async (req, res, next) => {
    console.log("get chat info");
    const chat = await Chat.findById(req.params.id).populate().exec();

    if (chat === null) {
      const err = new Error('chat not found');
      err.status = 404;
      next(err);
    }

    res.status(200).json({ chat });
  }),
];

// Handle POST to create an chat
exports.chat_create_post = [
  // verifyJWT,
  asyncHandler(async (req, res, next) => {
    console.log("🚀 ~ file: chatApiController.js:44 ~ asyncHandler ~ req.body:", req.body)
    console.log("🚀 ~ file: chatApiController.js:44 ~ asyncHandler ~ req.file:", req.file)

    const buddies  = JSON.parse(req.body.buddies);

    const existingChat = await Chat.findOne({buddies}, '').exec();

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
      console.log("🚀 ~ file: chatApiController.js:63 ~ asyncHandler ~ err:", err)
      throw new CustomError(500, 'Error saving chat');
    }
  }),
];
