const User = require('../models/User');

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
                    if (rows[0].Title === 'Administrator') {
                        req.session.admin = rows[0].Id;
                        res.end('/admin');
                    }
                    else if (rows[0].Title === 'Student') {
                        req.session.student = rows[0].Id;
                        res.end('/student');
                    }
                    else if (rows[0].Title === 'Operator') {
                        req.session.operator = rows[0].Id;
                        res.end('/operator');
                    }
                    else if (rows[0].Title === 'Teacher') {
                        req.session.operator = rows[0].Id;
                        res.end('/teacher');
                    }
                }
                else {
                    res.end('No users');
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