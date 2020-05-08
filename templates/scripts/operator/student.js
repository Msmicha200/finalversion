document.addEventListener('DOMContentLoaded', () => {
	const studentTable = uvm.q('.student-table');

	studentTable.addEventListener('change', event => {
		const { target } = event;
		const studentId = target.parentNode
			.parentNode.parentNode.dataset.studentid;

		if (target.classList.contains('uvm--toggle') && studentId) {
			uvm.ajax({
				url: '/operator/changeStatus',
				type: 'POST',
				data: {
					userId: studentId,
					status: target.checked ? 1 : 0
				}
			})
		}
	});
});