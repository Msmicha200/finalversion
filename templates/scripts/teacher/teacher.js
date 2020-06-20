document.addEventListener('DOMContentLoaded', () => {
    const disciplines = uvm.q('.disciplines');
    const groups = uvm.q('.groups');
    const gradesTable = uvm.q('.grades-table');
    const addLesson = uvm.q('.add-lesson');
    const doc = document.documentElement;
    let disciplineId;
    let groupId;

    addLesson.addEventListener('click', () => {
        doc.classList.add('grade-modal');
    });

    disciplines.addEventListener('click', event => {
        const { target } = event;
        if (target.classList.contains('uvm--option')) {
            disciplineId = target.dataset.disciplid;
            uvm.ajax({
                type: 'POST',
                url: '/teacher/getGroups',
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
                addLesson.classList.remove('active-element');
                tbody.innerHTML = '';
                gradesTable.classList.add('active-element');
            })
            .catch(error => {
                console.log(error);
            });
        }
    });

    const lessonModal = uvm.q('.cls-lesson-modal');

    lessonModal.addEventListener('click', event => {
        event.preventDefault();
        closeTeacher();
    });

    const notifications = uvm.q('.notifications');
    const notifWrapper = uvm.q('.messages-container');
    const dot = uvm.q('.notif-dot');

    groups.addEventListener('click', event => {
        const { target } = event;

        dot.classList.remove('active-element');
        if (target.classList.contains('uvm--option')) {
            groupId = target.dataset.groupid;

            uvm.ajax({
                url: '/teacher/grades',
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
                    const notifs = uvm.qe(div, '.notifications');
                    const grades = uvm.qe(div, '.grades');
                    const lessons = uvm.qe(div, '.lessons');
                    const cols = uvm.qe(div, '.cols');
                    const thead = uvm.qe(gradesTable,  'thead tr');
                    const thTd = uvm.qae(gradesTable,  'thead tr .removable');
                    const colWrapper = uvm.q('.cols');
                    const tbody = uvm.qe(gradesTable, 'tbody');
                    
                    thTd.forEach(elem => {
                        thead.removeChild(elem);
                    });
                    tbody.innerHTML = grades.innerHTML;
                    cols.insertAdjacentHTML('afterbegin', '<col>');
                    colWrapper.innerHTML = cols.innerHTML;
                    thead.insertAdjacentHTML('beforeend', lessons.innerHTML);
                    addLesson.classList.add('active-element');
                    notifications.classList.add('active-element');
                    notifWrapper.innerHTML = notifs.innerHTML;

                    if (uvm.qae(notifWrapper, '.message-container').length > 0) {
                        dot.classList.add('active-element');
                    }
                }
            }).
            catch(err => {
                console.log(err);
            });
        }
    });

    notifications.addEventListener('click', () => {
        doc.classList.add('notif-modal');
    });

    gradesTable.addEventListener('change', event => {
        const { target } = event;
        const { studentid } = target.parentNode.parentNode.dataset;
        const { gradeid } = target.dataset;
        const grade = target.value;
        console.log(target)
        uvm.ajax({
            url: '/teacher/setGrade',
            type: 'POST',
            data: {
                studentid,
                gradeid,
                grade
            }
        })
        .then(res => {

            if (grade == 2) {
                target.parentNode.classList.add('bad');
            }

            if (grade > 2 && target.parentNode.classList.contains('bad')) {
                target.parentNode.classList.remove('bad');
            }

            if (res === 'false') {
                return;
            }
        })
        .catch(err => {
            console.log(err);
        });
    });

    const acceptLesson = uvm.q('.accept-lesson');

    acceptLesson.addEventListener('click', () => {
        const lesson = uvm.q('.lesson-type.uvm--selected') || false;

        if (lesson) {
            uvm.ajax({
                url: '/teacher/addLesson',
                type: 'POST',
                data: {
                    typeId: lesson.dataset.lessontype,
                    disciplineId,
                    groupId
                }
            })
            .then(res => {
                if (res != 'false' && res.length > 1) {
                    const div = document.createElement('div');

                    div.innerHTML = res;

                    const newCol = uvm.qae(div, '.cols col');
                    const newHead = uvm.qae(div, '.lessons td');
                    const newGrades = uvm.qae(uvm.qe(div, '.inserted-grades'), 'td');
                    const trs = uvm.qae(gradesTable, 'tbody tr');
                    const thTr = uvm.qe(gradesTable, 'thead tr');
                    const cols = uvm.qe(gradesTable, '.cols');
                    console.log(trs.length)
                    if ((newGrades.length / trs.length) == 2) {
                        const data = [];

                        trs.forEach((tr, idx) => {
                            tr.appendChild(newGrades[idx]);
                        });

                        for (let i = (newGrades.length / 2); i < newGrades.length; i++) {
                            data.push(newGrades[i]);
                        }     

                        trs.forEach((tr, idx) => {  
                            tr.appendChild(data[idx]);
                        });
                    }
                    else {
                        trs.forEach((tr, idx) => {
                            tr.appendChild(newGrades[idx]);
                        })
                    }
                    
                    newCol.forEach(col => {
                        cols.appendChild(col);
                    });
                    
                    newHead.forEach(lesson => {
                        thTr.append(lesson);
                    });

                    doc.classList.remove('grade-modal');
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    });

    const clsModal = uvm.q('.close-notifs');

    clsModal.addEventListener('click', () => {
        doc.classList.remove('notif-modal');
    });

    const modalContent = uvm.q('.notif-modal-content');

    modalContent.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('accept-notify-teacher')) {
            const { id } = target.dataset;
            
            uvm.ajax({
                type: 'POST',
                url: '/teacher/removeNotif',
                data: {
                    id
                }
            })
            .then(res => {
                if (res == 'true') {
                    target.parentNode.classList.add('accepted-message');
                    setTimeout(() => {
                        target.parentNode.style.display = 'none';
                    }, 150);
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    });

    $('.calendar').datepicker({
        beforeShow:function(textbox, instance){
            $(this).parent().append($(instance.dpDiv[0]));
            $(this).parent().addClass('active-cal');
        }
    });
});
