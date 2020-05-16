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
        }
    });

    const addGroup = uvm.q('.add-group');
    const acceptGroup = uvm.q('.accept-group');

    addGroup.addEventListener('click', () => {
        doc.classList.add('group-modal');
    });

    acceptGroup.addEventListener('click', event => {
        event.preventDefault();

        const groupForm = document.forms.addGroup;
        const inputs = uvm.qae(groupForm, '.uvm--input-wrapper > input');
        const teacherSelect = uvm.q('.gr-group-select > .uvm--current-item');
        const specSelect = uvm.q('.spec-group-select > .uvm--current-item');
        const teacher = uvm.q('.uvm--option.uvm--selected.teacher-option') || false;
        const spec = uvm.q('.uvm--option.uvm--selected.spec-option') || false;
        const data = new FormData(groupForm);

        if (uvm.valid(inputs) && teacher) {
            data.append('curatorId', teacher.dataset.teacherid);
            data.append('curatorName', teacher.textContent.trim());
            data.append('specId', spec.dataset.specid);
            uvm.ajax({
                url: '/operator/addGroup',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                const groupTable = uvm.q('.group-table');
                const tbody = uvm.qe(groupTable, 'tbody')
                const tableWrapper = groupTable.parentNode;

                if (res === 'Duplicate') {
                    return;
                }

                tbody.innerHTML += res;
                clearModal();
                teacherSelect.innerHTML = 'Оберіть викладача';
                specSelect.innerHTML = 'Оберіть спеціальність';
                tableWrapper.scrollTop = tableWrapper.scrollHeight;
            })
            .catch (error => {
                console.log(error);
            });
        }
        else {
            const selects = [teacher, spec];
            if (!teacher) {
                uvm.selectErr(teacherSelect.parentNode);
            }
            if (!spec) {
                uvm.selectErr(specSelect.parentNode);
            }
        }

    });
});