document.addEventListener('DOMContentLoaded', () => {
	const specialities = uvm.q('.specialities');
	const targets = ['speciality-row', 'course-row', 'group-row'];
	specialities.addEventListener('click', event => {
		const { target } = event;

		targets.forEach(elem => {
			if (target.classList.contains(elem)) {
				const list = uvm.qae(target, '.opened');

				list.forEach(elem => {
					elem.classList.remove('opened');
				});

				setTimeout(() => {
					target.classList.toggle('opened');
				}, 20);
			}
		});
	});
});