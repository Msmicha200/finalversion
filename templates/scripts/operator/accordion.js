document.addEventListener('DOMContentLoaded', () => {
	const specialities = uvm.q('.specialities');

	specialities.addEventListener('click', event => {
		const { target } = event;
		if (target.classList.contains('speciality')) {
			target.classList.toggle('opened');
			console.log('cont');
		}
	});
});