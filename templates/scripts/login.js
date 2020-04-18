document.addEventListener('DOMContentLoaded', () => {

	const loginButton = uvm.byId('log-in');
	const loginInput = uvm.byId('login');
	const passwordInput = uvm.byId('password');


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
				url: '/users/checkUser',
				type: 'POST',
				data: {
					login: login,
					password: password
				}
			})
			.then(res => {
				console.log(res);
				if (res === '/admin') {
					window.location.href = '/admin';
				}
				else if (res === '/student') {
					window.location.href = '/student';
				}
				else if (res === '/operator') {
					window.location.href = '/operator';
				}
				else if (res === '/teacher') {
					window.location.href = '/teacher';
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