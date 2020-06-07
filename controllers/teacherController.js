const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');

module.exports = class TeacherController {
	index (req, res) {
		if (req.session.teacher) {
			Discipline.getDisciplines(false, req.session.teacher)
			.then(([disciplines]) => {
				res.render('teacher/index.twig', { disciplines });
			})
			.catch(error => {
				console.log(error);
				res.end('false');
			});
		}
		else {
			res.redirect('/user');
		}
	}

	getGroups (req, res) {
		if (req.session.teacher) {
			if (req.body.disciplineId) {
				Group.getGroups(false, req.body.disciplineId)
				.then(([groups]) => {
					res.render('teacher/groupResponse.twig', { groups });
				})
				.catch(error => {
					console.log(error);
					res.end('false');
				});
			}
		}
	}
}