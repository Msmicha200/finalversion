const express = require('express');
const OperatorController = require('../controllers/operatorController');
const router = express.Router();
const operatorController = new OperatorController();

router.get('/', operatorController.index);

router.post('/getGroups', operatorController.groups);

router.post('/getDisciplines', operatorController.disciplines);

module.exports = router;