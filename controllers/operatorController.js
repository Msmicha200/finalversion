const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');

const groupRegex = /^[А-я0-9\-]{3,64}$/;
const errno = 1062;

module.exports = class OperatorController {

    async index (req, res) {
        if (!req.session.operator) {
            res.redirect('/user');
            return;
        }
        
        const [status] = await User.statusCheck(req.session.operator);

        if (!status[0].IsActive) {
            req.session.destroy();
            res.redirect('/user');
            return;
        }
        else {
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
            ).catch(err => {
                console.log(err);
                res.end('Internal server error');1
            })
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

                Program.getProgram(disciplineId, groupId).
                then(([themes]) => {
                    res.render('operator/themes.twig', 
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

    newTheme (req, res) {
        const { theme, disciplineId, groupId } = req.body;
        const themeData = {
            Theme: theme
        };

        for (const data in themeData) {
            if (!regex[data].test(themeData[data])) {
                res.end('Error');
                return;
            }
        }

        Program.addTheme(disciplineId, groupId, theme)
        .then(([result]) => {
            themeData['Id'] = result.insertId;
            res.render('operator/newTheme.twig', { themeData });
        })
        .catch(error => {
            console.log(error);
            res.end('Error');
        });
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

        if (!Tools.valid(user)) {
            res.end('Error');
            return;
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
                    console.log(error);
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

    editStudent (req, res) {
        if (req.session.operator) {
            const { id, firstName, lastName, middleName, email, number, 
                login, groupId } = req.body;
            const user = {
                FirstName: firstName,
                LastName: lastName,
                MiddleName: middleName,
                Email: email,
                PhoneNumber: number,
                Login: login
            };

            if (!Tools.valid(user)) {
                res.end('Error');
                return;
            }

            if (id && groupId) {
                User.editUser(id, lastName, firstName, middleName, login,
                    email, number, groupId)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log(error);
                    if (error.errno === errno) {
                        res.end('Duplicate');
                    }
                    else {
                        res.end('Error');
                    }
                });
            }
            else {
                res.end('Error');
            }
        }
    }

    editTeacher (req, res) {
        if (req.session.operator) {
            const { id, firstName, lastName, middleName, email, number, 
                login } = req.body;
            const user = {
                FirstName: firstName,
                LastName: lastName,
                MiddleName: middleName,
                Email: email,
                PhoneNumber: number,
                Login: login
            };

            if (!Tools.valid(user)) {
                res.end('Error');
                return;
            }

            if (id) {
                User.editUser(id, lastName, firstName, middleName, login,
                    email, number)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log(error);
                    if (error.errno === errno) {
                        res.end('Duplicate');
                    }
                    else {
                        res.end('Error');
                    }
                });
            }
            else {
                res.end('Error');
            }
        }
    }

    editOperator (req, res) {
        if (req.session.operator) {
            const { id, firstName, lastName, middleName, email, number, 
                login } = req.body;
            const user = {
                FirstName: firstName,
                LastName: lastName,
                MiddleName: middleName,
                Email: email,
                PhoneNumber: number,
                Login: login
            };

            if (!Tools.valid(user)) {
                res.end('Error');
                return;
            }

            if (id) {
                User.editUser(id, lastName, firstName, middleName, login,
                    email, number)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log(error);
                    if (error.errno === errno) {
                        res.end('Duplicate');
                    }
                    else {
                        res.end('Error');
                    }
                });
            }
            else {
                res.end('Error');
            }
        }
    }

    editDiscipline (req, res) {
        if (req.session.operator) {
            const { id, title } = req.body;
            const discipline = {
                Title: title
            };

            if (!Tools.valid(discipline)) {
                res.end('Error');
                return;
            }

            if (id) {
                Discipline.editDiscipline(id, title)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log(error);
                    if (error.errno === errno) {
                        res.end('Duplicate');
                    }
                    else {
                        res.end('Error');
                    }
                });
            }
            else {
                res.end('Error');
            }
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

        if (groupTitle && curatorId && curatorName && groupRegex
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

    editGroup (req, res) {
        if (req.session.operator) {
            const {id, groupTitle, specId, curatorId} = req.body;

            if (groupRegex.test(groupTitle) && id && curatorId && specId) {
                Group.editGroup(id, groupTitle, specId, curatorId)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(error => {
                    console.log(error);
                    if (error.errno === errno) {
                        res.end('Duplicate');
                    }
                    else {
                        res.end('Error');
                    }
                });
            }
        }
        else {
            res.end('Error');
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

        if (!Tools.valid(discipline)) {
            res.end('Error');
            return;
        }

        Discipline.addDiscipline(title)
        .then(([result]) => {
            discipline['Id'] = result.insertId;
            res.render('operator/disciplineResponse.twig', { discipline });
        })
        .catch(error => {
            if (error.errno === errno) {
                res.end('Duplicate');
            }
            else {
                res.end('false');
            }
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
