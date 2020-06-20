document.addEventListener('DOMContentLoaded', () => {
    const disciplines = uvm.q('.disciplines');
    // const groups = uvm.q('.groups');
    const gradesTable = uvm.q('.grades-table-wrapper');

    disciplines.addEventListener('click', event => {
        const { target } = event;
        if (target.classList.contains('uvm--option')) {
            disciplineId = target.dataset.disciplid;
            uvm.ajax({
                type: 'POST',
                url: '/student/getGrades',
                data: {
                    disciplineId
                }
            })
            .then(res => {
                console.log(disciplineId);
                if (res != 'false') {
                    gradesTable.innerHTML = res;
                    const table = uvm.q('.grades-table');
                    table.classList.add('active-element');
                }
                // const tbody = uvm.qe(gradesTable, 'tbody');
                // const lessons = uvm.qae(gradesTable, '.removable');
                // const thead = uvm.qe(gradesTable, 'thead tr');

                // if (res != 'false' && res.length > 1) {
                //     groups.innerHTML = res;
                // }
                // else {
                //     groups.innerHTML = 'Груп нема'
                // }
                // lessons.forEach(elem => {
                //     thead.removeChild(elem);
                // });
                // reportTable.innerHTML = '';
                // tbody.innerHTML = '';
                // gradesTable.classList.add('active-element');
            })
            .catch(error => {
                console.log(error);
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