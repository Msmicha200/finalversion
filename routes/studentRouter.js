const express = require('express');
const StudentController = require('../controllers/studentController');
const router = express.Router();
const studentController = new StudentController();

router.get('/', studentController.index);

module.exports = router;
