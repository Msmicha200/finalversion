document.addEventListener('DOMContentLoaded', () => {
    const disciplines = uvm.q('.disciplines');
    const groups = uvm.q('.groups');

    disciplines.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('uvm--option')) {
            uvm.ajax({
                type: 'POST',
                url: '/teacher/getGroups',
                data: {
                    disciplineId: target.dataset.disciplid
                }
            })
            .then(res => {
                if (res !== 'false' && res.length > 1) {
                    groups.innerHTML = res;
                }
                else {
                    groups.innerHTML = 'Груп нема'
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    });
});
