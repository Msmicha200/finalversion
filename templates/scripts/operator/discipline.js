document.addEventListener('DOMContentLoaded', () => {
    const addDiscipline = uvm.q('.add-discipline');
    const acceptDiscipline = uvm.q('.accept-discipline');

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
                const disciplTable = uvm.q('.discipline-table');
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
});