const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');
const Grade = require('../models/Grade');
const Lesson = require('../models/Lesson');
const types = {
    1: 'lec',
    2: 'tc',
    3: 'pw',
    4: 'iw',
    5: 'cw',
    6: 'lab',
    7: 'ret',
    8: 'sc',
    9: 'bc'
};

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
            const { disciplineId, groupId} = req.body;

            if (disciplineId && groupId) {
                Grade.getStudents(groupId)
                .then(([students]) => {
                    Lesson.getLessons(groupId, disciplineId)
                    .then(([lessons]) => {
                        Grade.getGrades(groupId)
                        .then(([grades]) => {
                            Grade.bind(students, lessons, grades)
                            .then(result => {
                                res.render('teacher/gradeResp.twig', { result });
                            })
                        })
                    });
                })
                .catch (error => {
                    console.log('Grades error');
                    res.end('false');
                })
            }
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

    addLesson (req, res) {
        if (req.session.teacher) {
            const { groupId, disciplineId, typeId } = req.body;

            if (groupId && disciplineId && typeId) {
                Lesson.addLesson(groupId, disciplineId, typeId)
                .then(([lesson]) => {
                    Grade.getGrades(false, lesson.insertId)
                    .then(([grades]) => {
                        const result = {
                            grades,
                            lessons: [
                                {
                                    Title: types[typeId]
                                }
                            ]
                        };

                        res.render('teacher/gradeResp.twig', { result });
                    });
                })
                .catch(error => {
                    console.log(error);
                    res.end('false');
                });
            }
        }
    }
}