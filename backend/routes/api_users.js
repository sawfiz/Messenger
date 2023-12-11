const express = require('express');
const router = express.Router();
const multer = require('multer');

const user_api_controller = require('../controllers/userApiController');

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
/* user requests */
// GET request for list of all users
// !Make sure /all route is place before /:id
router.get('/', upload.single('avatar'), user_api_controller.users_list);

// GET request for one user.
// router.get('/:id', user_api_controller.user_detail);

// POST request for creating user.
router.post('/', user_api_controller.user_create_post);

// PUT request to update user.
// router.put('/:id', user_api_controller.user_update);

// DELETE request to delete user.
// router.delete('/:id', user_api_controller.user_delete);

/* Parents requests */

module.exports = router;
