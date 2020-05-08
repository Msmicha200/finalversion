const User = require('../models/User');
const Group = require('../models/Group');
const Discipline = require('../models/Discipline');

module.exports = class OperatorController {

    index (req, res) {
        if (req.session.operator) {
            const data = {
                users: {
                    adminstrator: [],
                    student: [],
                    operator: [],
                    teacher: []
                },
                groups: {

                },
                disciplines: {

                },
                specialities: {

                }
            };

            User.getUsers()
            .then(([accounts]) => {
                for (const user of accounts) {
                    data.users[user.UserType].push(user);
                }
            })
            .then(() => Group.getGroups())
            .then(([groups]) =>
                data.groups = groups
            )
            .then(() =>  Discipline.getDisciplines())
            .then(([disciplines]) => 
                data.disciplines = disciplines
            )
            .then(() => Group.getSpecialities())
            .then(([specialities]) =>
                data.specialities = specialities
            )
            .then(() => 
                res.render('operator/index.twig', data)
            );
        }
        else {
            res.redirect('/user');
        }
    }

    groups (req, res) {
        if (req.session.operator) {
            const {specId, course} = req.body;
        
            if (specId && course) {
                Group.getGroups({
                    specId,
                    course
                })
                .then(([groups]) => {
                    res.render('operator/programGroups.twig', 
                        { groups });
                });
            }
            else {
                Group.getGroups()
                .then(([groups]) => {
                    res.send(groups);
                });
            }
        }
        else {
            res.redirect('/notfound');
        }
    }

    disciplines (req, res) {
        if (req.session.operator) {
            const { groupId } = req.body;
            const { url } = req;

            if (groupId) {
                Discipline.getDisciplines(groupId)
                .then(([disciplines]) => {
                    if (url === '/getDisciplines') {
                        res.render('operator/programDiscipl.twig', 
                            { disciplines });                        
                    }
                    else if (url === '/getDisciplToGroup') {
                        res.render('operator/groupDiscipl.twig',
                            { disciplines });
                    }

                })
                .catch(error => {
                    console.log('Error discipline select: ' + error);
                });
            }
            else {
                res.end('false');
            }
        }
        else {
            res.redirect('/notfound');
        }
    }

    program (req, res) {
        if (req.session.operator) {
            const {disciplineId, groupId} = req.body;

            if (disciplineId && groupId) {

                Discipline.program(disciplineId, groupId).
                then(([themes]) => {
                    res.render('operator/programThemes.twig', 
                        { themes });
                })
                .catch(error => {
                    console.log('Error with getting themes: ' + error);
                });
            }
            else {
                res.end('false');
            }
        }
        else {
            res.redirect('/notfound');
        }
    }

    passed (req, res) {
        if (req.session.operator) {
            const { dtogroupId } = req.body;
            const { status } = req.body;

            if (dtogroupId && status) {
                Discipline.changePassed(dtogroupId, status)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log('Error with changing passed: ' + error);
                });
            }
        }
    }

    status (req, res) {
        if (req.session.operator) {
            const { userId } = req.body;
            const { status } = req.body;

            if (userId, status) {
                User.changeStatus(userId, status)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log('Error with changing status: ' + error);
                })
            }
            else {
                res.end('false');
            }
        }
        else {
            res.redirect('/notfound');
        }
    }

}
