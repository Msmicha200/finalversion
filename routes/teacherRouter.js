const express = require('express');
const TeacherController = require('../controllers/teacherController');
const router = express.Router();
const teacherController = new TeacherController();

router.get('/', teacherController.index);

router.post('/getGroups', teacherController.getGroups);

router.get('/grades', teacherController.grades);

router.post('/setGrade', teacherController.setGrade);

module.exports = router;
