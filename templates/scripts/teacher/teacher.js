document.addEventListener('DOMContentLoaded', () => {
    const disciplines = uvm.q('.disciplines');
    const groups = uvm.q('.groups');
    const gradesTable = uvm.q('.grades-table');

    disciplines.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('uvm--option')) {
            uvm.ajax({
                type: 'POST',
                url: '/teacher/getGroups',
                data: {
                    disciplineId: target.dataset.disciplid
                }
            })
            .then(res => {
                if (res !== 'false' && res.length > 1) {
                    groups.innerHTML = res;
                }
                else {
                    groups.innerHTML = 'Груп нема'
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    });

    groups.addEventListener('click', event => {
        uvm.ajax({
            url: '/teacher/grades',
            type: 'GET'
        })
        .then(res => {
            if (res != 'false') {
                const div = document.createElement('div');
                
                div.innerHTML = res;

                const grades = uvm.qe(div, '.grades');
                const lessons = uvm.qe(div, '.lessons');
                const cols = uvm.qe(div, '.cols');
                const thead = uvm.q('.grades-table thead > tr');
                const colWrapper = uvm.q('.cols');
                const tbody = uvm.qe(gradesTable, 'tbody');

                tbody.innerHTML = grades.innerHTML;
                colWrapper.innerHTML += cols.innerHTML;
                thead.innerHTML += lessons.innerHTML;
            }
        }).
        catch(err => {
            console.log(err);
        })
    });

    gradesTable.addEventListener('change', event => {
        const { target } = event;
        const { studentid } = target.parentNode.parentNode.dataset;
        const { gradeid } = target.dataset;
        const grade = target.value;
        
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
            if (res === 'false') {
                return;
            }
        })
        .catch(err => {
            console.log(err);
        });
    })
});
