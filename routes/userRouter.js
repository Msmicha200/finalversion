const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const userController = new UserController();

router.get('/', userController.index);
router.post('/checkUser', userController.authUser);
router.get('/logout', userController.logout);

module.exports = router;
