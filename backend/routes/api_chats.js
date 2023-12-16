const express = require('express');
const router = express.Router();
const passport = require('passport')
const multer = require('multer');

const chat_api_controller = require('../controllers/chatApiController');

// Protect routes using Passport JWT middleware
const requireAuth = passport.authenticate('jwt', { session: false });
// Use passport JWT middleware for every route of this router
router.use(requireAuth);

// Define the storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/avatars/'); // Specify the directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Initialize Multer with the defined storage
const upload = multer({ storage: storage });

/* chat requests */
// GET request for list of all chats
// !Make sure /all route is place before /:id
router.get('/', chat_api_controller.chats_list);

// GET request for one chat.
router.get('/:id', chat_api_controller.chat_detail);

// POST request for creating chat.
router.post('/', upload.single('avatar'), chat_api_controller.chat_create_post);

// PUT request to update chat.
// router.put('/:id', chat_api_controller.chat_update);

// PATCH request to update a particular field
router.patch('/:id', chat_api_controller.chat_patch)

// DELETE request to delete chat.
// router.delete('/:id', chat_api_controller.chat_delete);

/* Parents requests */

module.exports = router;
