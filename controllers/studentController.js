// const User = require('../models/User');
// const Group = require('../models/Group');
// const Program = require('../models/Program');
// const Discipline = require('../models/Discipline');
// const Tools = require('../components/Tools.js');
// const Grade = require('../models/Grade');
// const Lesson = require('../models/Lesson');
// const Notification = require('../models/Notification');
// const types = {
//     1: ['lec', 'ЛК'],
//     2: ['tc', 'ТА'],
//     3: ['pw', 'ПР'],
//     4: ['iw', 'СР'],
//     5: ['cw', 'КР'],
//     6: ['lab', 'ЛР'],
//     7: ['ret', 'ПА'],
//     8: ['sc', 'СА'],
//     9: ['bc', 'РК'],
//     10: 'retA'
// };

// module.exports = class StudentController {  
//     async index (req, res) {
//         if (!req.session.admin) {
//             res.redirect('/user');
//             return;
//         }

//         Discipline.getDisciplines()
//         .then(([disciplines]) => {
//             const data = {
//                 disciplines: disciplines,
//                 name: 'Адміністратор'
//             }
//             res.render('admin/index.twig', data);
//         })
//         .catch(error => {
//             console.log(error);
//             res.end('false');
//         });

//     }
// }