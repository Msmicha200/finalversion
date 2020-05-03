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
    }

    disciplines (req, res) {
        if (req.session.operator) {
            const { groupId } = req.body;

            if (groupId) {
                Discipline.getDisciplines(groupId)
                .then(([disciplines]) => {
                    res.render('operator/programDiscipl.twig', 
                        { disciplines });
                }).catch(error => {
                    console.log('Error discipline select: ' + error);
                })
            }
        }
    }

}