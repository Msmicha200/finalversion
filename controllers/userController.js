const User = require('../models/User');

exports.authUser = (request, response) => {
    const  {login , password} = request.body;

    if (login && password) {
        User.checkUser(login, password)
        .then(([rows, fileds]) => {
            if (rows.Title === 'Operator') {
                response.end('Operator');
            }
            else if (rows.Title === 'Student') {
                response.end('Student')
            }
            else if (rows.Title === 'Admin') {
                response.end('Admin');
            }
            else if (rows.Title === 'Teacher') {
                response.end('Teacher');
            }
            else {
                response.set('Content-Type', 'text/plain');

                response.end('No users');
            }
        })
        .catch(err => {
            console.log('We got an error');
            console.log(err);
        });
    }
};

exports.loginUser = (request, response) => {
    response.render('login/index.ejs');
};