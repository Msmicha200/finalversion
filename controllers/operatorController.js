const User = require('../models/User');

module.exports = class OperatorController {

	index (req, res) {
		if (req.session.operator) {
            User.getUsers()
            .then(([rows]) => {
                const users = {
                	adminstrator: [],
				    student: [],
				    operator: [],
				    teacher: []
                };

                if (rows.length) {
                    for (const user of rows) {
                        users[user.UserType].push(user);
                    }
                    console.log(users);
                }
                res.render('operator/index.twig', { users });
            });
		}
		else {
			res.redirect('/user');
		}
	}

}