const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'smtp',
	port: 587, // or 465
	secure: false, // or true if port is 465
	auth: {
		user: 'Login',
		pass: 'Password'
	} 
});

const from = 'mail from';
const subject = 'Password reseting';
const text = 'For resetting your password visit ';
module.exports = class Mail {
	static sendMail (email, link) {
		return transporter.sendMail({
			from: from,
			to: email,
			subject: subject,
			text: text + link
		})
		.then(result => {
			return true;
		})
		.catch(err => {
			console.log('Error during the sending ' + err);
		});
	}
}