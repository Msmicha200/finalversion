const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');
const Grade = require('../models/Grade');

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

    async grades (req, res) {
       const lessons = await Grade.getLessons(1, 1);
       const grades = await Grade.getGrades(1);
       const students = await Grade.getStudents(1);

       Grade.bind(students, lessons, grades)
       .then(result => {
            res.send(result);
       });
    }
}