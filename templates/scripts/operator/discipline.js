document.addEventListener('DOMContentLoaded', () => {
    const addDiscipline = uvm.q('.add-discipline');
    const acceptDiscipline = uvm.q('.accept-discipline');
    const disciplTable = uvm.q('.discipline-table');
    const disciplForm = document.forms.addDiscipline;
    const inputs = uvm.qae(disciplForm, '.uvm--input-wrapper > input');
    const acceptEdit = uvm.q('.accept-edit-discipline');
    const searchDiscipl = uvm.byId('search-discipl');

    searchDiscipl.addEventListener('input', () => {
        const all = uvm.qa('.discipline-table tbody tr');

            all.forEach(elem => {
                if (elem.textContent.trim().toLowerCase()
                    .includes(searchDiscipl.value.toLowerCase())) {
                    elem.style.display = 'table-row';
                }
                else {
                    elem.style.display = 'none';
                }
            });
    });

    addDiscipline.addEventListener('click', () => {
        doc.classList.add('discipline-modal');
    });

    acceptDiscipline.addEventListener('click', event => {
        event.preventDefault();

        const data = new FormData(disciplForm);

        if (uvm.valid(inputs)) {
            uvm.ajax({
                url: '/operator/addDiscipline',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate' || res === 'Error') {
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

    const disciplTeachers = uvm.q('.ds-teacher-wrapper');
    const tableWrapper = disciplTeachers.parentNode;
    const tbody = uvm.qe(disciplTeachers, 'tbody')
    let discipline;
    
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
                const div = document.createElement('div');
                
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
        else if (target.classList.contains('edit-discipline')) {
            discipline = target.parentNode.parentNode;

            const data = uvm.qae(discipline, '.editable');

            acceptDiscipline.classList.add('none');
            acceptEdit.classList.remove('none');

            data.forEach((elem, index) => {
                inputs[index].value = elem.innerText;
            });
            doc.classList.add('discipline-modal');
        }
    });

    acceptEdit.addEventListener('click', () => {
        const data = new FormData(disciplForm);

        if (uvm.valid(inputs)) {
            data.append('id', discipline.dataset.disciplineid);

            const td = uvm.qae(discipline, '.editable');

            uvm.ajax({
                url: '/operator/editDiscipline',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate' || res === 'Error') {
                    console.log(res);
                    return;
                }

                const td = uvm.qae(discipline, '.editable');

                td.forEach((elem, index) => {
                    elem.textContent = inputs[index].value;
                });

                const nodes = uvm.qa(`.discipline[data-disciplineid="${data.get('id')}"]`);

                nodes.forEach(elem => {
                    elem.textContent = data.get('title');
                });

                clearModal();
            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
    });

    const addTeacher = uvm.q('.add-teacher-discipline');
    const acceptTeacher = uvm.q('.accept-ds-teacher');

    addTeacher.addEventListener('click', () => {
        const discipline = uvm.qe(disciplTable, '.selected');

        if (discipline && discipline.dataset.disciplineid) {
            doc.classList.add('ds-teacher-modal');
        }
    });

    acceptTeacher.addEventListener('click', event => {
        event.preventDefault();
        const discipline = uvm.qe(disciplTable, '.selected');
        const teacher = uvm.q('.discipl-teacher.uvm--selected');
        const data = new FormData();
        const teacherSelect = uvm.q('.ds-teach-select > .uvm--current-item');

        if (discipline && teacher && discipline.dataset.disciplineid &&
                teacher.dataset.teacherid) {
            data.append('disciplineId', discipline.dataset.disciplineid);
            data.append('teacherId', teacher.dataset.teacherid);
            data.append('teacherName', teacher.textContent.trim());
            uvm.ajax({
                url: '/operator/addDisciplToTeacher',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate') {
                    uvm.selectErr(teacherSelect.parentNode);
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
    });
});