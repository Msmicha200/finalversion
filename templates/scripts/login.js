document.addEventListener('DOMContentLoaded', () => {

	const loginButton = uvm.byId('log-in');
	const loginInput = uvm.byId('login');
	const passwordInput = uvm.byId('password');
    const users = {
        Administrator: 'admin',
        Student: 'student',
        Operator: 'operator',
        Teacher: 'teacher'
    }

	const error = () => {
		loginInput.classList.add('error');
		passwordInput.classList.add('error');

		setTimeout(() => {
			loginInput.classList.remove('error');
			passwordInput.classList.remove('error');
		}, 3000);
	};

	loginButton.addEventListener('click', () => {
		const login = loginInput.value.trim();
		const password = passwordInput.value.trim();

		if (login && password) {			
			uvm.ajax({
				url: '/user/checkUser',
				type: 'POST',
				data: {
					login: login,
					password: password
				}
			})
			.then(res => {
				console.log(res);
				if (res !== 'false') {
					for (const user in users) {
						if (res === users[user]) {
							window.location.href = `/${users[user]}`;
						}
					}
				}
				else {
					error();
				}
			})
			.catch(error => {
				console.log('Error' + error);
			});
		}
		else {
			error();
		}
	});

});
