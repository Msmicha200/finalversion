const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.use('/checkUser', userController.authUser);
userRouter.use('/login', userController.loginUser);

module.exports = userRouter;