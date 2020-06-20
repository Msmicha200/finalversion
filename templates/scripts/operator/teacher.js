document.addEventListener('DOMContentLoaded', () => {
    const addTeacher = uvm.q('.add-teacher');
    const teacherTable = uvm.q('.teacher-table');
    const acceptEdit = uvm.q('.accept-edit-teacher');
    const teacherForm = document.forms.addTeacher;
    const inputs = uvm.qae(teacherForm, '.uvm--input-wrapper > input');
    const searchTeach = uvm.byId('search-teacher');

    searchTeach.addEventListener('input', () => {
        const all = uvm.qa('.teacher-table tbody tr');

            all.forEach(elem => {
                if (elem.textContent.trim().toLowerCase()
                    .includes(searchTeach.value.toLowerCase())) {
                    elem.style.display = 'table-row';
                }
                else {
                    elem.style.display = 'none';
                }
            });
    });

    addTeacher.addEventListener('click', () => {
        acceptEdit.classList.add('none');
        acceptTeacher.classList.remove('none');
        doc.classList.add('teacher-modal');
        passInput(teacherForm, true);
    });

    const acceptTeacher = uvm.q('.accept-teacher');

    acceptTeacher.addEventListener('click', event => {
        event.preventDefault();

        const data = new FormData(teacherForm);

        if (uvm.valid(inputs)) {

            uvm.ajax({
                url: '/operator/addTeacher',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                console.log(res);             
                if (res === 'Duplicate') {
                    console.log(res);
                    return;
                }

                if (res === 'Error') {
                    console.log(res);
                    return;
                }

                const tbody = uvm.qe(teacherTable, 'tbody')
                const tableWrapper = teacherTable.parentNode;
                const div = document.createElement('div');
                const options = uvm.q('.teacher-options.uvm--options-list');
                const dsTeachers = uvm.q('.ds-teachers-list.uvm--options-list');

                div.innerHTML = res;
                options.innerHTML += uvm.qe(div, 'div[data-teacherselect]').innerHTML;
                dsTeachers.innerHTML += uvm.qe(div, 'div[data-disciplteacher]').innerHTML;
                tbody.innerHTML += uvm.qe(div, 'table[data-teachertable]').innerHTML;
                clearModal();
                tableWrapper.scrollTop = tableWrapper.scrollHeight;

            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
    });

    let teacher;

    teacherTable.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('edit-teacher')) {
            teacher = target.parentNode.parentNode;

            const data = uvm.qae(teacher, '.editable');

            passInput(teacherForm, false);
            acceptTeacher.classList.add('none');
            acceptEdit.classList.remove('none');

            data.forEach((elem, index) => {
                inputs[index].value = elem.innerText;
            });
            doc.classList.add('teacher-modal');
        }
    });

    acceptEdit.addEventListener('click', () => {
        const data = new FormData(teacherForm);

        data.delete('password');
        if (uvm.valid(inputs, false)) {
            data.append('id', teacher.dataset.userid);

            const td = uvm.qae(teacher, '.editable');
            
            uvm.ajax({
                url: '/operator/editTeacher',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate' || res === 'Error') {
                    console.log(res);
                    return;
                }

                const td = uvm.qae(teacher, '.editable');

                td.forEach((elem, index) => {
                    elem.textContent = inputs[index].value;
                });

                const nodes = uvm.qa(`.teacher[data-userid="${data.get('id')}"]`); 

                nodes.forEach(elem => {
                    elem.textContent = `${data.get('lastName')} 
                    ${data.get('firstName')} ${data.get('middleName')}`;
                });

                clearModal();
            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
    });
});
