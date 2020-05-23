const User = require('../models/User');
const Group = require('../models/Group');
const Discipline = require('../models/Discipline');
const regex = {
    FirstName: /^[А-я]{2,50}$/,
    LastName: /^[А-я]{2,50}$/,
    MiddleName: /^[А-я]{2,50}$/,
    Email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PhoneNumber: /^[0-9]{6,20}$/,
    Login: /^[A-z0-9]{3,64}$/,
    Password: /^.{6,64}$/,
    Title: /^[А-я0-9\-]{3,256}$/
};
const Twig = require('twig');
const fs = require('fs');
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
            FirstName: firstName,
            LastName: lastName,
            MiddleName: middleName,
            Email: email,
            PhoneNumber: number,
            Login: login,
            Password: password
        };

        for (const data in user) {
            if (!regex[data].test(user[data])) {
                res.end('Error');
                return;
            }
        }

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
        else if (url === '/addTeacher') {
            const teacher = user;

            User.addUser(lastName, firstName, middleName, login,
                email, number, password, 4)
            .then(([result]) => {
                user['Id'] = result.insertId;
                console.log(user);
                res.render('operator/teacherResponse.twig', { teacher });
            })
            .catch(error => {
                res.end('Duplicate');
            });
        }
        else if (url === '/addOperator') {
            User.addUser(lastName, firstName, middleName, login,
                email, number, password, 2)
            .then(([result]) => {
                user['id'] = result.insertId;
                res.render('operator/operator.twig', { user });
            })
            .catch(error => {
                res.end('Duplicate');
            });
        }
    }

    newGroup (req, res) {
        const { groupTitle, curatorId, curatorName, specId } = req.body;
        const group = {
            Title: groupTitle,
            curatorId,
            LastName: curatorName,
            MiddleName: '',
            FirstName: '',
            Course: 1
        };
        const regexTitle = /^[А-я0-9\-]{3,64}$/;

        if (groupTitle && curatorId && curatorName && regexTitle
            .test(groupTitle)) {

            Group.addGroup(groupTitle, specId, curatorId)
            .then(([result]) => {
                group['Id'] = result.insertId;
                res.render('operator/groupResponse.twig', { group });
            })
            .catch(error => {
                console.log(error);
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
            Title: disciplTitle
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

    newDiscipline (req, res) {
        const { title } = req.body;
        const discipline = {
            Title: title
        };

        for (const data in discipline) {
            if (!regex[data].test(discipline[data])) {
                res.end('Error');
                return;
            }
        }

        Discipline.addDiscipline(title)
        .then(([result]) => {
            discipline['Id'] = result.insertId;
            res.render('operator/disciplineResponse.twig', { discipline });
        })
        .catch(error => {
            console.log(error);
        });
    }

    disciplToTeacher (req, res) {
        const { disciplineId, teacherId, teacherName } = req.body;
        const teacher = {
            LastName: teacherName,
            FirstName: '',
            MiddleName: '',
        }
        if (disciplineId && teacherId) {
            Discipline.addToTeacher(teacherId, disciplineId)
            .then(([result]) => {
                teacher['Id'] = result.insertId;
                res.render('operator/teacherDiscipl.twig', { teacher });
            })
            .catch(error => {
                console.log(error);
                res.end('Duplicate');
            })
        }
    }

}
