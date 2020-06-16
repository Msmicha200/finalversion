const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');
const Grade = require('../models/Grade');
const Lesson = require('../models/Lesson');
const Notification = require('../models/Notification');
const types = {
    1: ['lec', 'ЛК'],
    2: ['tc', 'ТА'],
    3: ['pw', 'ПР'],
    4: ['iw', 'СР'],
    5: ['cw', 'КР'],
    6: ['lab', 'ЛР'],
    7: ['ret', 'ПА'],
    8: ['sc', 'СА'],
    9: ['bc', 'РК'],
    10: 'retA'
};

module.exports = class AdminController {

    async index (req, res) {
        if (!req.session.admin) {
            res.redirect('/user');
            return;
        }
        
        const [status] = await User.statusCheck(req.session.admin);
        
        Discipline.getDisciplines()
        .then(([disciplines]) => {
            const data = {
                disciplines: disciplines,
                name: 'Адміністратор'
            }
            res.render('admin/index.twig', data);
        })
        .catch(error => {
            console.log(error);
            res.end('false');
        });
    }

    getGroups (req, res) {
        if (req.session.admin) {
            if (req.body.disciplineId) {
                Group.getGroups(false, req.body.disciplineId, false)
                .then(([groups]) => {
                    res.render('admin/groupResponse.twig', { groups });
                })
                .catch(error => {
                    console.log(error);
                    res.end('false');
                });
            }
        }
    }

    grades (req, res) {
        if (req.session.admin) {
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
                                res.render('admin/gradeResp.twig', { result });
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

    notification (req, res) {
        if (req.session.admin) {
            const { disciplineId, groupId, text } = req.body;

            if (disciplineId && groupId && text) {
                Notification.sendNotification(groupId, disciplineId, text)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(err => {
                    console.log(err);
                    res.send('false');
                })
            }
        }
    }
    
}
