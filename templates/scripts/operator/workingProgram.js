document.addEventListener('DOMContentLoaded', () => {
    const programTable = uvm.q('.speciality-table');

    programTable.addEventListener('click', event => {
        const { target } = event;
        const specId = target.dataset.specid;
        const course = target.dataset.course;
        const groupId = target.dataset.groupid
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
                const list = uvm.qae(target, '.groups-program');

                list.forEach(elem => {
                    target.removeChild(elem);
                })
                setTimeout(() => {
                    target.innerHTML += res;
                }, 150);
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
                const list = uvm.qae(target, '.disciplines-program');

                list.forEach(elem => {
                    target.removeChild(elem);
                })
                setTimeout(() => {
                    target.innerHTML += res;
                }, 150);  
            })
        }
    });
});