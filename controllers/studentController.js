const User = require('../models/User');
const Group = require('../models/Group');
const Program = require('../models/Program');
const Discipline = require('../models/Discipline');
const Tools = require('../components/Tools.js');
const Grade = require('../models/Grade');
const Lesson = require('../models/Lesson');
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

module.exports = class StudentController {  
    async index (req, res) {
        if (!req.session.student) {
            res.redirect('/user');
            return;
        }

        const [status] = await User.statusCheck(req.session.student);
        
        if (!status[0].IsActive) {
            req.session.destroy();
            res.redirect('/user');
            return;
        }
        else {
            Discipline.getForSt(req.session.student)
            .then(([disciplines]) => {
                const data = {
                    disciplines: disciplines,
                    name: {
                        LastName: status[0].LastName,
                        FirstName: status[0].FirstName,
                        MiddleName: status[0].MiddleName
                    }
                }
                res.render('student/index.twig', data);
            })
            .catch(error => {
                console.log(error);
                res.end('false');
            });
        }
    }

    async getGrades (req, res) {
        if (!req.session.student) {
            res.redirect('/user');
            return;
        }

        const { disciplineId } = req.body;
        const [ student ] = await Grade.getStudents(false, req.session.student); 
        const [ lessons ] = await Lesson.getLessons(student[0].GroupId, disciplineId);
        const [ grades ] = await Grade.getGrades(false, false, {
            Id: req.session.student,
            disciplId: disciplineId
        });
        const binded = await Grade.bind(student, lessons, grades);
        const result = {
            result: binded,
            group: student[0].Title
        };

        res.render('student/gradeResp.twig',  result);
    } 
}
