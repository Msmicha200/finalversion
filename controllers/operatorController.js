const User = require('../models/User');

module.exports = class OperatorController {

	index (req, res) {
		if (req.session.operator) {
			res.render('operator/index.ejs');
		}
		else {
			res.redirect('/user');
		}
	}

}