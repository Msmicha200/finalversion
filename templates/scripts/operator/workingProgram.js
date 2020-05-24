document.addEventListener('DOMContentLoaded', () => {
    const programTable = uvm.q('.speciality-table');
    const themesTable = uvm.q('.themes');
    const tbody = uvm.qe(themesTable, 'tbody');

    programTable.addEventListener('click', event => {
        const { target } = event;

        const specId = target.dataset.specid;
        const course = target.dataset.course;
        const groupId = target.dataset.groupid
        const disciplineId = target.dataset.disciplineid;

        if (target.classList.contains('course-row') 
            && specId && course) {
            uvm.ajax({
                url: '/operator/getGroups',
                type: 'POST',
                data: {
                    specId,
                    course
                }
            })
            .then(res => {
                const list = uvm.qe(target, '.groups-program');
                
                list.innerHTML = res;       
            })
            .catch(error => {
                console.log('Error: ' + error);
            });
        }
        else if (target.classList.contains('group-row') ) {
            uvm.ajax({
                url: '/operator/getDisciplines',
                type: 'POST',
                data: {
                    groupId
                }
            })
            .then(res => {
                if (res !== 'false') {
                    const list = uvm.qe(target, '.disciplines-program');

                    list.innerHTML = res;
                } 
            });
        }
        else if (target.classList.contains('discipline-row') 
            && disciplineId) {
            const groupId = target.parentNode.parentNode
                .dataset.groupid;

            uvm.ajax({
                url: '/operator/getThemes',
                type: 'POST',
                data: {
                    disciplineId,
                    groupId
                }
            })
            .then(res => {
                if (res !== 'false') {
                    const selected = uvm.qe(programTable, '.selected');

                    if (selected !== null) {
                        selected.classList.remove('selected');
                    }

                    target.classList.add('selected');
                    tbody.innerHTML = res;
                }
            });
        }
    });

    const addTheme = uvm.q('.add-theme');
    const acceptTheme = uvm.q('.accept-theme');

    addTheme.addEventListener('click', () => {
        const discipl = uvm.q('.specialities .discipline-row.selected');

        if (discipl && discipl.dataset.disciplineid) {
            doc.classList.add('program-modal');
        }
    });

    acceptTheme.addEventListener('click', event => {
        event.preventDefault();

        const themeForm = document.forms.addTheme;
        const discipl = uvm.q('.specialities .discipline-row.selected');
        const groupId = discipl.parentNode.parentNode.dataset.groupid;
        const disciplId = discipl.dataset.disciplineid;
        const inputs = uvm.qae(themeForm, '.uvm--input-wrapper > input');
        const data = new FormData(themeForm);

        if (uvm.valid(inputs) && discipl && groupId) {
            data.append('disciplineId', disciplId);
            data.append('groupId', groupId);
            uvm.ajax({
                url: '/operator/addTheme',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Error') {
                    console.log(res);
                    return;
                }

                const tableWrapper = themesTable.parentNode;

                tbody.innerHTML += res;
                clearModal();
                tableWrapper.scrollTop = tableWrapper.scrollHeight;
            })
            .catch(error => {

            });
        }
    });
});
