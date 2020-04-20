const User = require('../models/User');

const users = {
    Administrator: 'admin',
    Student: 'student',
    Operator: 'operator',
    Teacher: 'teacher'
}

module.exports = class UserController {
    
    index (req, res) {
        for (const user in users) {
            if (req.session[users[user]]) {
                res.redirect(`/${users[user]}`);
                return;
            }
        }
        
        res.render('login/index.ejs');
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
                red.end('false');
                console.log('We got an error: ' + err);
            });
        }
    }

    logout (req, res) {
        req.session.destroy();
        res.redirect('/user');
    }

}