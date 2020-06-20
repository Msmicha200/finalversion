document.addEventListener('DOMContentLoaded', () => {
    const remember = uvm.byId('remember');
    const mailInput = uvm.byId('email');
    const doc = document.documentElement;

    remember.addEventListener('click', () => {
        if (mailInput.value.length) {
            uvm.ajax({
                url: '/user/resetIt',
                type: 'POST',
                data: {
                    email: mailInput.value
                }
            })
            .then(res => {
                if (res == 'false') {
                    mailInput.classList.add('error');
                    setTimeout(() => {
                        mailInput.classList.remove('error');
                    }, 2000);
                }
                if (res == 'true') {
                    doc.classList.add('success-modal');
                }
            })
        }
        else {
            mailInput.classList.add('error');
            setTimeout(() => {
                mailInput.classList.remove('error');
            }, 2000);
        }
    });
});