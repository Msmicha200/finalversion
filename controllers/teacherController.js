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
const LESSON_TYPE = 7;

module.exports = class TeacherController {

    async index (req, res) {
        if (!req.session.teacher) {
            res.redirect('/user');
            return;
        }
        
        const [status] = await User.statusCheck(req.session.teacher);

        if (!status[0].IsActive) {
            req.session.destroy();
            res.redirect('/user');
            return;
        }
        else {
            Discipline.getDisciplines(false, req.session.teacher)
            .then(([disciplines]) => {
                const data = {
                    disciplines: disciplines,
                    name: {
                        LastName: status[0].LastName,
                        FirstName: status[0].FirstName,
                        MiddleName: status[0].MiddleName
                    }
                }
                res.render('teacher/index.twig', data);
            })
            .catch(error => {
                console.log(error);
                res.end('false');
            });
        }
    }

    getGroups (req, res) {
        if (req.session.teacher) {
            if (req.body.disciplineId) {
                Group.getGroups(false, req.body.disciplineId, req.session.teacher)
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
        if (req.session.teacher) {
            const { disciplineId, groupId} = req.body;

            if (disciplineId && groupId) {
                const [ students ] = await Grade.getStudents(groupId);
                const [ lessons ] = await Lesson.getLessons(groupId, disciplineId);
                const [ grades ] = await Grade.getGrades(groupId);
                const [ notifications ] = await Notification.
                    getNotifications(groupId, disciplineId);
                const   result = await Grade.bind(students, lessons, grades);
                const data = {
                    result,
                    notifications
                }

                res.render('teacher/gradeResp.twig', data);
            }
        }
    }

    removeNotif (req, res) {
        if (req.session.teacher) {
            const { id } = req.body;

            if (id) {
                Notification.watched(id)
                .then(([result]) => {
                    res.end('true');
                })
                .catch(err => {
                    console.log(err);
                    res.end('false');
                });
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

    async addLesson (req, res) {
        if (!req.session.teacher) return;
        const { groupId, disciplineId, typeId } = req.body;

        if (!groupId || !disciplineId || !typeId) return;

        const [ lesson ] = await Lesson.addLesson(groupId, disciplineId, typeId);
        const [ grades ] = await Grade.getGrades(false, lesson.insertId);
        const [ students ] = await Grade.getStudents(groupId);
        const [ nonActive ] = await Grade.getNonActive(groupId);
        const result = {
            grades,
            lessons: [{ 
                Title: types[typeId][0],
                External: types[typeId][1] 
            }]
        };

        if (typeId == 2) {
            students.forEach(async (st, idx) => {
                const entity = grades[idx];

                if (st.Id == entity.StudentId) {

                    let [ [{ gr: grade }] ] = await Grade.getAvgTheme(st.Id, disciplineId);
                    
                    if (grade == null) {
                        grade = 2;
                    }

                    entity.Grade = grade;
                    Grade.setGrade(st.Id, entity.Id, grade);
                }
            });

            const [ { insertId } ] = await Lesson.addLesson(groupId, disciplineId, LESSON_TYPE);
            const [ retGrades ] = await Grade.getGrades(false, insertId);
            result.grades.push(...retGrades);
            result.lessons.push({ 
                Title: types[LESSON_TYPE][0],
                External: types[LESSON_TYPE][1]
            });
        }
        else if (typeId == 8) {

            for (let i = 0; i < students.length; ++i)
            {
                const st = students[i];
                const entity = grades[i];
    
                if (st.Id == entity.StudentId) {
                    const sem = await Grade.getSem(st.Id, disciplineId, groupId, lesson.insertId);
                    entity.Grade = sem;
                    Grade.setGrade(st.Id, entity.Id, sem);
                }
            }
        }

        // result.grades.forEach((gr, idx) => {
        //     if (gr.StudentId == 121) {
        //         console.log(gr)
        //     }
        //     nonActive.forEach((us) => {
        //         if (gr.StudentId == us.Id) {
        //             result.grades.splice(idx, 1);
        //         }
        //     })
        // });
        res.render('teacher/gradeResp.twig', { result });
    }
}
