document.addEventListener('DOMContentLoaded', () => {
	const specialities = uvm.q('.specialities');

	specialities.addEventListener('click', event => {
		const { target } = event;
		if (target.classList.contains('speciality-row')) {
			target.classList.toggle('opened');
		}
		else if (target.classList.contains('course-row')) {
			target.classList.toggle('opened');
		}
		else if (target.classList.contains('group-row')) {
			target.classList.toggle('opened');
		}
	});
});