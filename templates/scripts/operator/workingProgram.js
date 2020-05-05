document.addEventListener('DOMContentLoaded', () => {
    const programTable = uvm.q('.speciality-table');

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
                    const tbody = uvm.q('.themes tbody');
                    const selected = uvm.qe(programTable, '.selected');

                    if (selected !== null) {
                        selected.classList.remove('selected');
                    }
                    target.classList.add('selected');
                    tbody.innerHTML = res;
                }
            })
        }
    });
});
