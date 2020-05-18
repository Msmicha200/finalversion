document.addEventListener('DOMContentLoaded', () => {
    const addOperator = uvm.q('.add-operator');

    addOperator.addEventListener('click', () => {
        doc.classList.add('operator-modal');
    });

    const acceptOperator = uvm.q('.accept-operator');

    acceptOperator.addEventListener('click', event => {
        event.preventDefault();

        const operatorForm = document.forms.addOperator;
        const inputs = uvm.qae(operatorForm, '.uvm--input-wrapper > input');
        const data = new FormData(operatorForm);

        if (uvm.valid(inputs)) {

            uvm.ajax({
                url: '/operator/addOperator',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                const operatorTable = uvm.q('.operator-table');
                const tbody = uvm.qe(operatorTable, 'tbody')
                const tableWrapper = operatorTable.parentNode;

                if (res === 'Duplicate') {
                    console.log(res);
                    return;
                }

                if (res === 'Error') {
                    console.log(res);
                    return;
                }

                tbody.innerHTML += res;
                clearModal();
                tableWrapper.scrollTop = tableWrapper.scrollHeight;
            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
    });
});