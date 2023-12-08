const express = require('express');
const router = express.Router();

const chat_api_controller = require('../controllers/chatApiController');

/* chat requests */
// GET request for list of all chats
// !Make sure /all route is place before /:id
router.get('/', chat_api_controller.chats_list);

// GET request for one chat.
// router.get('/:id', chat_api_controller.chat_detail);

// POST request for creating chat.
router.post('/', chat_api_controller.chat_create_post);

// PUT request to update chat.
// router.put('/:id', chat_api_controller.chat_update);

// DELETE request to delete chat.
// router.delete('/:id', chat_api_controller.chat_delete);

/* Parents requests */

module.exports = router;
