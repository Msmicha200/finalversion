document.addEventListener('DOMContentLoaded', () => {
    const addDiscipline = uvm.q('.add-discipline');
    const acceptDiscipline = uvm.q('.accept-discipline');
    const disciplTable = uvm.q('.discipline-table');

    addDiscipline.addEventListener('click', () => {
        doc.classList.add('discipline-modal');
    });

    acceptDiscipline.addEventListener('click', event => {
        event.preventDefault();
        
        const disciplForm = document.forms.addDiscipline;
        const inputs = uvm.qae(disciplForm, '.uvm--input-wrapper > input');
        const data = new FormData(disciplForm);

        if (uvm.valid(inputs)) {
            uvm.ajax({
                url: '/operator/addDiscipline',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate' && res === 'Error') {
                    console.log(res);
                    return;
                }

                const div = document.createElement('div');
                const tbody = uvm.qe(disciplTable, 'tbody');
                const tableWrapper = disciplTable.parentNode;
                const options = uvm.q('.ds-gr-options');

                div.innerHTML = res;
                tbody.innerHTML += uvm.qe(div, 'table[data-discipltable]').innerHTML;
                options.innerHTML += uvm.qe(div, 'div[data-disciplselect]').innerHTML;
                clearModal();
                tableWrapper.scrollTop = tableWrapper.scrollHeight;
            })
            .catch(error => {
                console.log(error);
            });
        }
        else {

        }
    });

    disciplTable.addEventListener('click', event => {
        const { target } = event;

        if (target.parentNode.tagName === 'TR') {
            const disciplId = target.parentNode.dataset.disciplineid || false;

            if (!disciplId) {
                return;
            }

            uvm.ajax({
                url: '/operator/getDisciplToTeacher',
                type: 'POST',
                data: {
                    disciplineId: disciplId
                }
            })
            .then(res =>{
                if (res === 'false') {
                    console.log(res);
                    return;
                }

                const selected = uvm.qe(disciplTable, '.selected');
                const disciplTeachers = uvm.q('.ds-teacher-wrapper');
                const div = document.createElement('div');
                const tableWrapper = disciplTeachers.parentNode;
                const tbody = uvm.qe(disciplTeachers, 'tbody')
                
                if (selected !== null) {
                    selected.classList.remove('selected');
                }

                div.innerHTML = res;
                target.parentNode.classList.add('selected');
                tbody.innerHTML = uvm.qe(div, 'table[data-dstable]').innerHTML;
                tableWrapper.scrollTop = tableWrapper.scrollHeight;
            })
            .catch(error => {
                console.log(error);
            });
        }
    });
});