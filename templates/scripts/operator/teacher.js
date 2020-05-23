document.addEventListener('DOMContentLoaded', () => {
    const addTeacher = uvm.q('.add-teacher');

    addTeacher.addEventListener('click', () => {
        doc.classList.add('teacher-modal');
    });

    const acceptTeacher = uvm.q('.accept-teacher');

    acceptTeacher.addEventListener('click', event => {
        event.preventDefault();

        const teacherForm = document.forms.addTeacher;
        const inputs = uvm.qae(teacherForm, '.uvm--input-wrapper > input');
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

                const teacherTable = uvm.q('.teacher-table');
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
});
