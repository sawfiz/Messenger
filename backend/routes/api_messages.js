const express = require('express');
const router = express.Router();
// const multer = require('multer');
const { verifyJWT } = require('../middleware/verifyJWT');

const message_api_controller = require('../controllers/messageApiController');

router.use(verifyJWT)

// Define the storage for the uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/avatars/'); // Specify the directory to save the uploaded files
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + '-' + file.originalname);
//   },
// });
// Initialize Multer with the defined storage
// const upload = multer({ storage: storage });

/* message requests */
// GET request for list of all messages
// !Make sure /all route is place before /:id
router.get('/', message_api_controller.messages_list);

// POST request for creating message.
// router.post(
//   '/',
//   upload.single('avatar'),
//   message_api_controller.message_create_post
// );
router.post('/', message_api_controller.message_create_post)

module.exports = router;