const User = require('../models/User');
const Mail = require('../components/Mail.js');

const users = {
    administrator: 'admin',
    student: 'student',
    operator: 'operator',
    teacher: 'teacher'
};

module.exports = class UserController {
    
    index (req, res) {
        for (const user in users) {
            if (req.session[users[user]]) {
                res.redirect(`/${users[user]}`);
                return;
            }
        }
        
        res.render('login/index.twig');
    }

    authUser (req, res) {
        const  {login , password} = req.body;

        if (login && password) {
            User.checkUser(login, password)
            .then(([rows, fileds]) => {
                if (rows.length) {
                    const row = rows[0];

                    for (const user in users) {
                        if (row.Title == user) {
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
                res.end('false');
                console.log('We got an error: ' + err);
            });
        }
    }

    reset (req, res) {
        for (const user in users) {
            if (req.session[users[user]]) {
                res.redirect(`/${users[user]}`);
                return;
            }
        }
        
        res.render('reset/index.twig');
    }

    async resetpass (req, res) {
        const { email } = req.body;

        if (email) {
            const token = User.generateToken();
            const result = await User.resetPassOnEmail(email, token);

            if (result[0].affectedRows > 0) {
                Mail.sendMail(email, token)
                .then(mailed => {
                    res.end('true');
                });
            }
            else {
                res.end('false');
            }
        }
    }

    newPass (req, res) {
        if (!req.query.token) {
            res.redirect('/user');
            return;
        }

        res.render('newpass/index.twig', {
            token: req.query.token
        });

    }

    setPass (req, res) {
        const { token, password } = req.body;

        if (token && password) {
            User.setPassword(token, password)
            .then(result => {
                if (result[0].affectedRows > 0) {
                    res.end('true');
                }
                else {
                    res.end('false');
                }
            })
            .catch(err => {
                console.log(err);
                res.end('false');
            })
        }
    }

    logout (req, res) {
        req.session.destroy();
        res.redirect('/user');
    }

}
