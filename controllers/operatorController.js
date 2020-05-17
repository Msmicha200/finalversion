const User = require('../models/User');
const Group = require('../models/Group');
const Discipline = require('../models/Discipline');
const regex = {
    firstName: /^[А-я]{2,50}$/,
    lastName: /^[А-я]{2,50}$/,
    middleName: /^[А-я]{2,50}$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    number: /^[0-9]{6,20}$/,
    login: /^[A-z0-9]{3,64}$/,
    password: /^.{6,64}$/
};

module.exports = class OperatorController {

    index (req, res) {
        if (req.session.operator) {
            const data = {
                users: {
                    administrator: [],
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

    user (req, res) {
        const { url } = req;
        const { firstName, lastName, middleName, email, number, login,
            password, groupId, groupTitle} = req.body;
        const user = {
            firstName,
            lastName,
            middleName,
            email,
            number,
            login,
            password
        };

        for (const data in user) {
            if (!regex[data].test(user[data])) {
                res.end('Error');
                return;
            }
        }

        res.end('Duplicate');
        return;

        if (url === '/addStudent') {
            if (groupId && groupTitle) {
                User.addUser(lastName, firstName, middleName, login,
                    email, number, password, 3, groupId)
                .then(([result]) => {
                    user['groupId'] = groupId;
                    user['groupTitle'] = groupTitle;
                    user['id'] = result.insertId;
                    res.render('operator/student.twig', { user });
                })
                .catch(error => {
                    res.end('Duplicate');
                });
            }
        }
    }

    newGroup (req, res) {
        const { groupTitle, curatorId, curatorName, specId } = req.body;
        const group = {
            groupTitle,
            curatorId,
            curatorName,
            specId
        };
        const regexTitle = /^[А-я0-9\-]{3,64}$/;

        if (groupTitle && curatorId && curatorName && regexTitle
            .test(groupTitle)) {

            Group.addGroup(groupTitle, specId, curatorId)
            .then(([result]) => {
                group['Id'] = result.insertId;
                res.render('operator/group.twig', { group });
            })
            .catch(error => {
                res.end('Duplicate');
            });
        }
    }

    getTeachers (req, res) {
        const { disciplineId } = req.body;

        if (disciplineId) {
            Discipline.getTeachers(disciplineId)
            .then(([teachers]) => {
                res.render('operator/disciplineTeachers.twig',
                    { teachers });
            })
            .catch(error => {
                console.log(error);
                res.end('false');
            });
        }
    }

    dsiciplToGroup (req, res) {
        const { disciplineId, teacherId, disciplTitle, 
            groupId } = req.body;
        const disciplines = {
            Title: disciplTitle,
            Passed: 0
        };

        if (disciplineId && teacherId && groupId && disciplTitle) {
            Discipline.addToGroup(teacherId, groupId, disciplineId)
            .then(([result]) => {
                disciplines['Id'] = result.insertId;
                res.render('operator/groupDiscipl.twig', { disciplines: {
                    disciplines
                }});
            })
            .catch(error => {
                console.log(error);
                res.end('Duplicate');
            });
        }
    }

}
