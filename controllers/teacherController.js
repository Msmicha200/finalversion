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

        grades (req, res) {
            if (req.session.teacher) {
                Grade.getStudents(1)
                .then(([students]) => {
                    Grade.getLessons(1, 1)
                    .then(([lessons]) => {
                        Grade.getGrades(1)
                        .then(([grades]) => {
                            Grade.bind(students, lessons, grades)
                            .then(result => {
                                // res.send(result);
                                res.render('teacher/gradeResp.twig', { result });
                            })
                        })
                    });
                });
            }
        }

        setGrade (req, res) {
            if (req.session.teacher) {
                const {studentid, grade, gradeid } = req.body;

                if (studentid && grade && gradeid) {
                    Grade.setGrade(studentid, gradeid, grade)
                    .then(([result]) => {
                        res.end('true');
                    })
                    .catch(error => {
                        console.log(error);
                        res.end('false');
                    });
                }
            }
        }
}