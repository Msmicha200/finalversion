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
    9: 'bc',
    10: 'retA'
};
const LESSON_TYPE = 7;

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

    async addLesson (req, res) {
        if (!req.session.teacher) return;

        const { groupId, disciplineId, typeId } = req.body;

        if (!groupId || !disciplineId || !typeId) return;

        const [ lesson ] = await Lesson.addLesson(groupId, disciplineId, typeId);
        const [ grades ] = await Grade.getGrades(false, lesson.insertId);
        const [ students ] = await Grade.getStudents(groupId);
        
        const result = {
            grades,
            lessons: [{ Title: types[typeId] }]
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
            result.lessons.push({ Title: types[LESSON_TYPE] });
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

        res.render('teacher/gradeResp.twig', { result });
    }
}