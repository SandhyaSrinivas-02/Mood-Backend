const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller');
const auth = require('../middleware/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/update-profile', auth, userController.updateProfile);
router.put('/update-password', auth, userController.updatePassword);

module.exports = router;
