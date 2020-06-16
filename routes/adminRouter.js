const express = require('express');
const AdminController = require('../controllers/adminController');
const router = express.Router();
const adminController = new AdminController();

router.get('/', adminController.index);

router.post('/getGroups', adminController.getGroups);

router.post('/getGroups', adminController.getGroups);

router.post('/grades', adminController.grades);

router.post('/sendNotification', adminController.notification);

module.exports = router;
