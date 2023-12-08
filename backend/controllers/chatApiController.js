// Libraries
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const validateObjectId = require('../middleware/validateObjectId');
const { verifyJWT } = require('../middleware/verifyJWT');
const CustomError = require('../utils/CustomError');

// Model
const Chat = require('../models/chat');

// Handle GET all chats.
exports.chats_list = [
  verifyJWT,
  asyncHandler(async (req, res, next) => {
    const currentUser = res.locals.currentUser;
    console.log("🚀 ~ file: chatApiController.js:17 ~ asyncHandler ~ currentUser:", currentUser)
    const chats_list = await Chat.find({}, '').exec();
    res.status(200).json({ chats_list });
  }),
];

// Handle GET details of a specific chat.
exports.chat_detail = [
  validateObjectId,
  asyncHandler(async (req, res, next) => {
    const [chat] = await Promise.all([Chat.findById(req.params.id).populate(buddies).exec()]);

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
  asyncHandler(async (req, res, next) => {
    const { buddies } = req.body;

    const existingChat = await Chat.findOne({buddies}, '').exec();

    if (existingChat) {
      return res.status(201).json({ message: existingChat });
    }

    try {
      const chat = new Chat({
        name: req.body.name,
        buddies: req.body.buddies,
        groupChat: req.body.groupChat,
      });
      const result = await chat.save();
      res.status(201).json({ message: result });
    } catch (err) {
      throw new CustomError(500, 'Erro saving chat');
    }
  }),
];
