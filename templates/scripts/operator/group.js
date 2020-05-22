document.addEventListener('DOMContentLoaded', () => {
    const grouptable = uvm.q('.group-table');
    const disicplines = uvm.q('.group-disciplines');

    grouptable.addEventListener('click', event => {
        const { target } = event;

        if (target.parentNode.tagName === 'TR') {
            const groupId = target.parentNode.dataset.groupid || false;

            if (!groupId) {
                return;
            }

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
        const teacher = uvm.q('.uvm--selected.teacher-option') || false;
        const spec = uvm.q('.uvm--selected.spec-option') || false;
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
                if (res === 'Duplicate') {
                    return;
                }

                const options = uvm.q('.st-gr.uvm--options-list');
                const groupTable = uvm.q('.group-table');
                const tbody = uvm.qe(groupTable, 'tbody')
                const tableWrapper = groupTable.parentNode;
                const div = document.createElement('div');

                div.innerHTML = res;
                options.innerHTML += uvm.qe(div, 'div[data-groupselect]').innerHTML;
                tbody.innerHTML += uvm.qe(div, 'table[data-grouptable]').innerHTML;
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
            if (!teacher) {
                uvm.selectErr(teacherSelect.parentNode);
            }
            if (!spec) {
                uvm.selectErr(specSelect.parentNode);
            }
        }
    });

    const addDiscipline = uvm.q('.add-to-group');
    const disciplineMolda = uvm.q('.ds-group-modal');

    addDiscipline.addEventListener('click', () => {
        const group = uvm.q('.group-table .selected') || false;

        if (group) {
            doc.classList.add('ds-group-modal');
        }
    });

    const disciplineSelect = uvm.q('.uvm--select.ds-group-select');

    disciplineSelect.addEventListener('click', event => {
        const { target } = event;
        const disciplineId = target.dataset.disciplineid;
        const teachersWrapper = uvm.q('.gr-ds-teachers');

        if (target.classList.contains('ds-group-option') && disciplineId) {
            uvm.ajax({
                url: '/operator/getDisciplToTeacher',
                type: 'POST',
                data: {
                    disciplineId
                }
            })
            .then(res => {
                if (res !== 'false') {
                    teachersWrapper.innerHTML = res;                    
                }

                const div = document.createElement('div');
                
                div.innerHTML = res;
                teachersWrapper.innerHTML = uvm
                    .qe(div, 'div[data-teacherselect]').innerHTML;
            })
            .catch(error => {
                console.log(error);
            });
        } 
    });

    const acceptDiscipline = uvm.q('.accept-ds-group');

    acceptDiscipline.addEventListener('click', event => {
        event.preventDefault();

        const disciplSelect = uvm.q('.ds-group-select > .uvm--current-item'); 
        const teacherSelect = uvm.q('.ds-teacher-select > .uvm--current-item');
        const discipline = uvm.q('.ds-group-option.uvm--selected') || false;
        const teacher = uvm.q('.ds-teacher-option.uvm--selected') || false;
        const group = uvm.q('.group-table .selected') || false;
        const data = new FormData();

        if (discipline && teacher && group) {
            data.append('disciplineId', discipline.dataset.disciplineid);
            data.append('disciplTitle', discipline.textContent.trim());
            data.append('teacherId', teacher.dataset.teacherid);
            data.append('groupId', group.dataset.groupid);

            uvm.ajax({
                url: '/operator/addDisciplToGroup',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                const disciplTable = uvm.q('.group-disciplines');
                const tbody = uvm.qe(disciplTable, 'tbody');
                const tableWrapper = disciplTable.parentNode;

                if (res === 'Duplicate') {
                    console.log(res);
                    return;
                }

                tbody.innerHTML += res;
                clearModal();
                teacherSelect.innerHTML = 'Оберіть викладача';
                disciplSelect.innerHTML = 'Оберіть диспципліну';
                tableWrapper.scrollTop = tableWrapper.scrollHeight;
            })
            .catch(error => {
                console.log(error);
            });
        }
        else {
            if (!teacher) {
                uvm.selectErr(teacherSelect.parentNode);
            }
            if (!discipline) {
                uvm.selectErr(disciplSelect.parentNode);
            }
        }
    });
});
