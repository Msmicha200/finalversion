const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');

module.exports = class TeacherController {
	index (req, res) {
		if (req.session.teacher) {
			res.render('teacher/index.twig');
		}
		else {
			res.redirect('/user');
		}
	}
}