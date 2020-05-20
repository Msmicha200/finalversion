document.addEventListener('DOMContentLoaded', () => {
    const addDiscipline = uvm.q('.add-discipline');
    const acceptDiscipline = uvm.q('.accept-discipline');

    addDiscipline.addEventListener('click', () => {
        doc.classList.add('discipline-modal');
    });

    acceptDiscipline.addEventListener('click', event => {
        event.preventDefault();
        
        const disciplForm = document.forms.addDiscipline;
        const teacherSelect = uvm.q('.ds-select > .uvm--current-item');
        const inputs = uvm.qae(disciplForm, '.uvm--input-wrapper > input');
        const teacher = uvm.q('.ds-teacher-option.uvm--selected') || false;
        const data = new FormData();

        if (uvm.valid(inputs) && teacher) {
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