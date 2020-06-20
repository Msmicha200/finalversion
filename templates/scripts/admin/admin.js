document.addEventListener('DOMContentLoaded', () => {
    const disciplines = uvm.q('.disciplines');
    const groups = uvm.q('.groups');
    const gradesTable = uvm.q('.grades-table');
    const addNotification = uvm.q('.add-notification');
    const doc = document.documentElement;
    let disciplineId;
    let groupId;

    addNotification.addEventListener('click', () => {
        doc.classList.add('newnotif-modal');
    });

    const newNotifModal = uvm.q('.new-notif-cls');

    newNotifModal.addEventListener('click', () => {
        doc.classList.remove('newnotif-modal');
    });

    disciplines.addEventListener('click', event => {
        const { target } = event;
        if (target.classList.contains('uvm--option')) {
            disciplineId = target.dataset.disciplid;
            uvm.ajax({
                type: 'POST',
                url: '/admin/getGroups',
                data: {
                    disciplineId
                }
            })
            .then(res => {
                const tbody = uvm.qe(gradesTable, 'tbody');
                const lessons = uvm.qae(gradesTable, '.removable');
                const thead = uvm.qe(gradesTable, 'thead tr');

                if (res != 'false' && res.length > 1) {
                    groups.innerHTML = res;
                }
                else {
                    groups.innerHTML = 'Груп нема'
                }
                lessons.forEach(elem => {
                    thead.removeChild(elem);
                });
                reportTable.innerHTML = '';
                tbody.innerHTML = '';
                gradesTable.classList.add('active-element');
            })
            .catch(error => {
                console.log(error);
            });
        }
    });

    const reportTable = uvm.q('.report-table');

    groups.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('uvm--option')) {
            groupId = target.dataset.groupid;

            uvm.ajax({
                url: '/admin/grades',
                type: 'POST',
                data: {
                    disciplineId,
                    groupId
                }
            })
            .then(res => {
                if (res != 'false') {
                    const div = document.createElement('div');
                    
                    div.innerHTML = res;
                    
                    const grades = uvm.qe(div, '.grades');
                    const lessons = uvm.qe(div, '.lessons');
                    const cols = uvm.qe(div, '.cols');
                    const thead = uvm.qe(gradesTable,  'thead tr');
                    const thTd = uvm.qae(gradesTable,  'thead tr .removable');
                    const colWrapper = uvm.q('.cols');
                    const tbody = uvm.qe(gradesTable, 'tbody');
                    const report = uvm.qe(div, '.report');

                    thTd.forEach(elem => {
                        thead.removeChild(elem);
                    });
                    tbody.innerHTML = grades.innerHTML;
                    cols.insertAdjacentHTML('afterbegin', '<col>');
                    colWrapper.innerHTML = cols.innerHTML;
                    reportTable.innerHTML = report.innerHTML;
                    thead.insertAdjacentHTML('beforeend', lessons.innerHTML);
                    addNotification.classList.add('active-element');

                }
            }).
            catch(err => {
                console.log(err);
            });
        }
    });

    const acceptNotif = uvm.q('.accept-notif');

    acceptNotif.addEventListener('click', () => {
        const area = uvm.byId('messageText');

        if (area.value.length > 5) {
            uvm.ajax({
                type: 'POST',
                url: '/admin/sendNotification',
                data: {
                    disciplineId,
                    groupId,
                    text: area.value
                }
            })
            .then(res => {
                if (res == 'true') {
                    doc.classList.remove('newnotif-modal');
                    area.value = '';
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    });

    const reportButton = uvm.q('.report-button');

    reportButton.addEventListener('click', () => {
        reportTable.parentNode.parentNode.classList.add('active-element');
    });

    const back = uvm.q('.back-grades');

    back.addEventListener('click', () => {
        reportTable.parentNode.parentNode.classList.remove('active-element');
    });

});
