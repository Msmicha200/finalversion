const User = require('../models/User');

const users = {
    Administrator: 'admin',
    Student: 'student',
    Operator: 'operator',
    Teacher: 'teacher'
}

module.exports = class UserController {
    
    index (req, res) {
        if (req.session.admin) {
            res.redirect('/admin');
        }
        else if (req.session.student) {
            res.redirect('/student');
        }
        else if (req.session.operator) {
            res.redirect('/operator');
        }
        else if (req.session.teacher) {
            res.redirect('/teacher');
        }
        else {
            res.render('login/index.ejs');
        }
    }

    authUser (req, res) {
        const  {login , password} = req.body;

        if (login && password) {
            User.checkUser(login, password)
            .then(([rows, fileds]) => {
                if (rows.length) {
                    const row = rows[0];

                    for (const user in users) {
                        if (row.Title === user) {
                            req.session[users[user]] = row.Id;
                            res.end(users[user]);    
                        }
                    }
                }
                else {
                    res.end('false');
                }
            })
            .catch(err => {
                console.log('We got an error');
                console.log(err);
            });
        }
    }

    logout (req, res) {
        req.session.destroy();
        res.redirect('/user');
    }

}