const User = require('../models/User');
const db = require('../components/Database.js');
const d = db.getConnection();

module.exports = class AdminController {

    index (req, res) {
        if (req.session.admin) {
            res.render('operator/index.twig');
        }
        else {
            res.redirect('/user');
        }
    }
    
}