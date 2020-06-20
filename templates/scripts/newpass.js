document.addEventListener('DOMContentLoaded', () => {
    const form = document.forms.newpass;
    const accept = uvm.byId('accept');
    const inputs = uvm.qae(form, '.uvm--input-wrapper > input');

    accept.addEventListener('click', event => {
        event.preventDefault();
        const data = new FormData(form);

        if (uvm.valid(inputs)) {
            data.append('token', accept.dataset.token);
            uvm.ajax({
                url: '/user/setpass',
                type: 'POST',
                data: uvm.dataToObj(data)
            })
            .then(res => {
                if (res == 'true') {
                    window.location.href = '/user'
                }
                else {
                    inputs[0].classList.add('error');
                    setTimeout(() => {
                        accept.classList.remove('error');
                    }, 2000);
                }
            })
        }
    })
});
