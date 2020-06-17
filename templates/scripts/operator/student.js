document.addEventListener('DOMContentLoaded', () => {
    const addStudent = uvm.q('.add-student');
    const doc = document.documentElement;
    const studentForm = document.forms.addStudent;
    const inputs = uvm.qae(studentForm, '.uvm--input-wrapper > input');
    const groupSelect = uvm.q('.st-group-select > .uvm--current-item');
    const acceptEdit = uvm.q('.accept-edit-student');
    const acceptStudent = uvm.q('.accept-student');
    const searchSt = uvm.byId('search-student');

    searchSt.addEventListener('input', () => {
        const all = uvm.qa('.student-table tbody tr > td');

            all.forEach(elem => {
                if (elem.textContent.toLowerCase().includes(searchSt.value)) {
                    elem.parentNode.style.display = 'table-row';
                }
                else {
                    elem.parentNode.style.display = 'none';
                }
            });
    });

    addStudent.addEventListener('click', () => {
        acceptEdit.classList.add('none');
        acceptStudent.classList.remove('none');
        doc.classList.add('student-modal');
        passInput(studentForm, true);
    });

    const studentTable = uvm.q('.student-table');

    acceptStudent.addEventListener('click', event => {
        event.preventDefault();

        const group = uvm.q('.uvm--option.uvm--selected.group-option') || false;
        const data = new FormData(studentForm);

        if (uvm.valid(inputs) && group) {
            data.append('groupId', group.dataset.groupid);
            data.append('groupTitle', group.textContent.trim());
            uvm.ajax({
                url: '/operator/addStudent',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                const tbody = uvm.qe(studentTable, 'tbody')
                const tableWrapper = studentTable.parentNode;

                if (res === 'Duplicate') {
                    console.log(res);
                    return;
                }

                if (res === 'Error') {
                    console.log(res);
                    return;
                }

                tbody.innerHTML += res;
                clearModal();
                groupSelect.innerHTML = 'Оберіть групу';
                tableWrapper.scrollTop = tableWrapper.scrollHeight;

            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
        else {
            if (!group) {
                uvm.selectErr(groupSelect.parentNode);
            }
        }
    });

    let student;
    let group;

    studentTable.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('edit-student')) {
            student = target.parentNode.parentNode;
            group = uvm.qe(student, '.st-group');

            const data = uvm.qae(student, '.editable');
            const groups = uvm.qa('.st-gr.uvm--options-list > li');

            passInput(studentForm, false);
            acceptStudent.classList.add('none');
            acceptEdit.classList.remove('none');

            for (const gr of groups) {
                if (group.innerText === gr.textContent.trim()) {
                    gr.classList.add('uvm--selected');
                    groupSelect.innerHTML = gr.innerHTML;
                    break;
                }
            }

            data.forEach((elem, index) => {
                inputs[index].value = elem.innerText;
            });
            doc.classList.add('student-modal');
        }
    });

    acceptEdit.addEventListener('click', event => {
        event.preventDefault();

        const data = new FormData(studentForm);
        const groupOption = uvm.q('.uvm--selected.group-option') || false;

        data.delete('password');
        if (uvm.valid(inputs, false)) {
            data.append('groupId', groupOption.dataset.groupid);
            data.append('id', student.dataset.userid);

            const td = uvm.qae(student, '.editable');
            
            uvm.ajax({
                url: '/operator/editStudent',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate' || res === 'Error') {
                    console.log(res);
                    return;
                }

                const td = uvm.qae(student, '.editable');

                td.forEach((elem, index) => {
                    elem.textContent = inputs[index].value;
                });

                group.textContent = groupOption.textContent.trim();
                clearModal();
                groupSelect.innerHTML = 'Оберіть групу';
            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
    });

});
