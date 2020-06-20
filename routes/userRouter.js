const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const userController = new UserController();

router.get('/', userController.index);

router.post('/checkUser', userController.authUser);

router.get('/logout', userController.logout);

router.get('/reset', userController.reset);

router.post('/resetIt', userController.resetpass);

router.get('/newpass', userController.newPass);

router.post('/setpass', userController.setPass);

module.exports = router;
