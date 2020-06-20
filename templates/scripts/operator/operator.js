document.addEventListener('DOMContentLoaded', () => {
    const addOperator = uvm.q('.add-operator');
    const acceptEdit = uvm.q('.accept-edit-operator');
    const acceptOperator = uvm.q('.accept-operator');
    const operatorForm = document.forms.addOperator;
    const operatorTable = uvm.q('.operator-table');
    const inputs = uvm.qae(operatorForm, '.uvm--input-wrapper > input');
    const searchOper = uvm.byId('search-operator');

    searchOper.addEventListener('input', () => {
        const all = uvm.qa('.operator-table tbody tr');

            all.forEach(elem => {
                if (elem.textContent.trim().toLowerCase()
                    .includes(searchOper.value.toLowerCase())) {
                    elem.style.display = 'table-row';
                }
                else {
                    elem.style.display = 'none';
                }
            });
    });

    addOperator.addEventListener('click', () => {
        acceptEdit.classList.add('none');
        acceptOperator.classList.remove('none');
        doc.classList.add('operator-modal');
        passInput(operatorForm, true);
    });

    acceptOperator.addEventListener('click', event => {
        event.preventDefault();

        const data = new FormData(operatorForm);

        if (uvm.valid(inputs)) {

            uvm.ajax({
                url: '/operator/addOperator',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
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

    let operator;

    operatorTable.addEventListener('click', event => {
        const { target } = event;

        if (target.classList.contains('edit-operator')) {
            operator = target.parentNode.parentNode;

            const data = uvm.qae(operator, '.editable');

            passInput(operatorForm, false);
            acceptOperator.classList.add('none');
            acceptEdit.classList.remove('none');

            data.forEach((elem, index) => {
                inputs[index].value = elem.innerText;
            });
            doc.classList.add('operator-modal');
        }
    });

    acceptEdit.addEventListener('click', () => {
        const data = new FormData(operatorForm);

        data.delete('password');
        if (uvm.valid(inputs, false)) {
            data.append('id', operator.dataset.userid);

            const td = uvm.qae(operator, '.editable');
            
            uvm.ajax({
                url: '/operator/editOperator',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res === 'Duplicate' || res === 'Error') {
                    console.log(res);
                    return;
                }

                const td = uvm.qae(operator, '.editable');

                td.forEach((elem, index) => {
                    elem.textContent = inputs[index].value;
                });

                clearModal();
            })
            .catch(error => {
                console.log('Internal server error' + error);
            });
        }
    });
});