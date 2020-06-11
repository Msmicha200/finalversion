const doc = document.documentElement;
const modals = ['student-modal', 'group-modal', 'ds-group-modal', 
    'teacher-modal', 'operator-modal', 'discipline-modal', 
    'ds-teacher-modal', 'program-modal', 'grade-modal'];
const clearModal = event => {

    modals.forEach(elem => {
        const inputs = uvm.qae(uvm.q(`.${elem}`), 'input') || false;
        const selects = uvm.qa('.uvm--current-item');
        const selected = uvm.qa('.uvm--selected');

        doc.classList.remove(elem);
    
        inputs.forEach(elem => {
            elem.value = '';
        });

        selected.forEach (elem => {
            elem.classList.remove('uvm--selected');
        });
    });
};

const closeTeacher = () => {
    doc.classList.remove('grade-modal');
    // selected.forEach (elem => {
    //     elem.classList.remove('uvm--selected');
    // }); 
}

const passInput = (form, status) => {
    const input = uvm.qe(form, 'input[type="password"]').parentNode;
    status ? input.classList.remove('none') : 
        input.classList.add('none');
}

document.addEventListener('DOMContentLoaded', () => {
    const closeModal = uvm.qa('.close-modal');

    closeModal.forEach(elem => {

        elem.addEventListener('click', event => {
            event.preventDefault();
        });

        elem.addEventListener('click', clearModal);
    });

    const lessonModal = uvm.q('.cls-lesson-modal');

    lessonModal.addEventListener('click', event => {
        event.preventDefault();
        closeTeacher();
    });
});
