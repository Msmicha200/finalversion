const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: 'scp66.hosting.reg.ru',
	port: 465,
	secure: true,
	auth: {
		user: 'test@uvmtest.space',
		pass: '123456789q'
	} 
});

const from = 'test@uvmtest.space';
const subject = 'Password reseting';
const text = 'Ваш токен для сброса пароля ';

module.exports = class Mail {
	static sendMail (email, link) {
		return transporter.sendMail({
			from: from,
			to: email,
			subject: subject,
			text: text + link
		})
	}
}