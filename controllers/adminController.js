const User = require('../models/User');

module.exports = class AdminController {

    index (req, res) {
        if (req.session.admin) {
            res.render('admin/index.ejs');          
        }
        else {
            res.redirect('/user');
        }
    }
    
}