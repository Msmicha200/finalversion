document.addEventListener('DOMContentLoaded', () => {
    const grouptable = uvm.q('.group-table');
    const disicplines = uvm.q('.group-disciplines');

    grouptable.addEventListener('click', event => {
        const { target } = event;
        const groupId = target.parentNode.dataset.groupid;

        if (target.parentNode.tagName === 'TR' && groupId) {
            uvm.ajax({
                url: '/operator/getDisciplToGroup',
                type: 'POST',
                data: {
                    groupId
                }
            })
            .then(res => {
                const disciplines = uvm.q('.group-disciplines tbody');
                const selected = uvm.qe(grouptable, '.selected');

                if (selected !== null) {
                    selected.classList.remove('selected');
                }
                target.parentNode.classList.add('selected');
                disciplines.innerHTML = res;
            })
        }
    });

    disicplines.addEventListener('change', event => {
        const { target } = event;
        const dtogroupId = target.parentNode
            .parentNode.parentNode.dataset.dtogroup;

        if (target.classList.contains('uvm--toggle') && dtogroupId) {
            uvm.ajax({
                url: '/operator/passed',
                type: 'POST',
                data: {
                    dtogroupId,
                    status: target.checked ? 0 : 1
                }
            })
            .then(res => {

            })
        }
    })
});