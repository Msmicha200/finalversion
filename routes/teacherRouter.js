const express = require('express');
const TeacherController = require('../controllers/teacherController');
const router = express.Router();
const teacherController = new TeacherController();

router.get('/', teacherController.index);

module.exports = router;
