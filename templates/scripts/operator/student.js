document.addEventListener('DOMContentLoaded', () => {
    const addStudent = uvm.q('.add-student');
    const doc = document.documentElement;

    addStudent.addEventListener('click', () => {
        doc.classList.add('student-modal');
    });

    const acceptStudent = uvm.q('.accept-student');

    acceptStudent.addEventListener('click', event => {
        event.preventDefault();

        const studentForm = document.forms.addStudent;
        const inputs = uvm.qae(studentForm, '.uvm--input-wrapper > input');
        const groupSelect = uvm.q('.st-group-select > .uvm--current-item');
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
                const studentTable = uvm.q('.student-table');
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


});
