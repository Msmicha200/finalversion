const express = require('express');
const UserController = require('../controllers/userController');
const userRouter = express.Router();
const userController = new UserController();

userRouter.get('/', userController.index);
userRouter.post('/checkUser', userController.authUser);
userRouter.get('/logout', userController.logout);

module.exports = userRouter;
