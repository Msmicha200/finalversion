document.addEventListener('DOMContentLoaded', () => {
    const groupTable = uvm.q('.group-table');
    const disicplines = uvm.q('.group-disciplines');
    const acceptGroup = uvm.q('.accept-group');
    const acceptEdit = uvm.q('.accept-edit-group');
    const teacherSelect = uvm.q('.gr-group-select > .uvm--current-item');
    const specSelect = uvm.q('.spec-group-select > .uvm--current-item');
    const groupForm = document.forms.addGroup;
    const inputs = uvm.qae(groupForm, '.uvm--input-wrapper > input');
    const searchGr = uvm.byId('search-group');
    let group;
    let teacherTd;

    searchGr.addEventListener('input', () => {
        const all = uvm.qa('.group-table tbody tr');


            all.forEach(elem => {
                if (elem.textContent.trim().toLowerCase()
                    .includes(searchGr.value.toLowerCase())) {
                        console.log(elem)
                    elem.style.display = 'table-row';
                }
                else {
                    elem.style.display = 'none';
                }
            });
    });

    groupTable.addEventListener('click', event => {
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
                const selected = uvm.qe(groupTable, '.selected');

                if (selected !== null) {
                    selected.classList.remove('selected');
                }

                target.parentNode.classList.add('selected');
                disciplines.innerHTML = res;
            })
        }
        else if (target.classList.contains('edit-group')) {
            acceptGroup.classList.add('none');
            acceptEdit.classList.remove('none');
            doc.classList.add('group-modal');
            group = target.parentNode.parentNode;
            teacherTd = uvm.qe(group, '.teacherName');

            const data = uvm.qae(group, '.editable');
            const specId = teacherTd.dataset.specid;
            const teacherId = teacherTd.dataset.userid;
            const teacherOption = uvm
                .q(`.teacher-options > li[data-userid="${teacherId}"]`);
            const specialityOption = uvm
                .q(`.spec-options > li[data-specid="${specId}"`);

            data.forEach((elem, index) => {
                inputs[index].value = elem.textContent.trim();
            });

            teacherOption.classList.add('uvm--selected');
            specialityOption.classList.add('uvm--selected');
            teacherSelect.innerHTML = teacherOption.innerHTML;
            specSelect.innerHTML = specialityOption.innerHTML;
        }
    });

    acceptEdit.addEventListener('click', event => {
        event.preventDefault();

        const data = new FormData(groupForm);
        const teacherOption = uvm.q('.teacher-option.uvm--selected');
        const specOption = uvm.q('.spec-option.uvm--selected');

        if (uvm.valid(inputs)) {
            data.append('curatorId', teacherOption.dataset.userid);
            data.append('specId', specOption.dataset.specid);
            data.append('id', group.dataset.groupid);
            uvm.ajax({
                url: '/operator/editGroup',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                console.log(res);
                if (res === 'Duplicate' || res === 'Error') {
                    console.log(res);
                    return;
                }

                const td = uvm.qae(group, '.editable');

                td.forEach((elem, index) => {
                    elem.textContent = inputs[index].value;
                });

                clearModal();
                teacherTd.textContent = teacherOption.textContent.trim();
                teacherTd.dataset.specid = specOption.dataset.specid;
                teacherTd.dataset.userid = teacherOption.dataset.userid;
                teacherSelect.innerHTML = 'Оберіть класного керівника';
                specSelect.innerHTML = 'Оберіть спеціальність';
            })
            .catch(error => {
                console.log(error);
            });
        }
    });

    disicplines.addEventListener('change', event => {
        const { target } = event;
        const dtogroupId = target.parentNode
            .parentNode.parentNode.dataset.dtogroup;
        const { groupid } = uvm.q('.group-table tr.selected').dataset;

        if (target.classList.contains('uvm--toggle') && dtogroupId) {
            console.log(dtogroupId, target, groupid)
            uvm.ajax({
                url: '/operator/passed',
                type: 'POST',
                data: {
                    groupid,
                    dtogroupId,
                    status: target.checked ? 0 : 1
                }
            })
        }
    });

    const addGroup = uvm.q('.add-group');

    addGroup.addEventListener('click', () => {
        doc.classList.add('group-modal');
        acceptGroup.classList.remove('none');
        acceptEdit.classList.add('none');
    });

    acceptGroup.addEventListener('click', event => {
        event.preventDefault();

        const teacher = uvm.q('.uvm--selected.teacher-option') || false;
        const spec = uvm.q('.uvm--selected.spec-option') || false;
        const data = new FormData(groupForm);

        if (uvm.valid(inputs) && teacher) {
            data.append('curatorId', teacher.dataset.userid);
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
            data.append('teacherId', teacher.dataset.userid);
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
