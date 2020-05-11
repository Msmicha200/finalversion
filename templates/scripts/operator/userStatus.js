document.addEventListener('DOMContentLoaded', () => {
    const tables = uvm.qa('.user-table');

    tables.forEach(elem => {
        elem.addEventListener('change', event => {
            const { target } = event;
            const userId = target.parentNode
                .parentNode.parentNode.dataset.userid;

            if (target.classList.contains('uvm--toggle') && userId) {
                uvm.ajax({
                    url: '/operator/changeStatus',
                    type: 'POST',
                    data: {
                        userId: userId,
                        status: target.checked ? 1 : 0
                    }
                })
            }
        });
    });
});
