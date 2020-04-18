const express = require('express');
const AdminController = require('../controllers/adminController');
const adminRouter = express.Router();
const adminController = new AdminController();

adminRouter.get('/', adminController.index);

module.exports = adminRouter;