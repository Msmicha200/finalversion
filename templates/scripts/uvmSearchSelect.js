'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let currentSelect;
  const uvmSelect = document.querySelectorAll('.uvm--select');
  const uvmList = document.querySelectorAll('.uvm--options');
  const uvmInput = document.querySelectorAll('.uvm--input-search');

  for (const select of uvmSelect) {
    select.addEventListener('click', event => {
      if (event.target.tagName === 'INPUT') {
        return;
      }
      select.classList.toggle('uvm--opened');

      if (select.classList.contains('uvm--opened')) {
        currentSelect = select.querySelector('.uvm--options').
          querySelector('.uvm--options-list').children;
      }
      uvmInput[0].focus();
    }, true);
  }

  for (const list of uvmList) {
    list.addEventListener('click', event => {
      const { target } = event;
      const uvmSelected = target.parentNode.querySelector('.uvm--selected');

      if (uvmSelected !== null && target.tagName !== 'UL') {
        uvmSelected.classList.remove('uvm--selected');
      }

      if (target.tagName !== 'LI') {
        return;
      }
      target.classList.add('uvm--selected');
      target.parentNode.parentNode.
        previousElementSibling.textContent = target.textContent;

      target.classList.add('uvm--selected');

      if (document.querySelector('.main-search')) {
        const search = document.querySelector('.main-search');
        search.querySelector('input').value = '';
        search.classList.add('active-search');
      }

      if (document.querySelector('.clear')) {
        const clearBtn = document.querySelector('.clear');
        clearBtn.classList.add('active-clear');
      }
    }, true);
  }

  window.addEventListener('click', event => {
    const { target } = event;
    for (const select of uvmSelect) {
      if (!select.contains(target)) {
        select.classList.remove('uvm--opened');
      }
    }
  });

  window.addEventListener('touchstart', event => {
    const { target } = event;
    for (const select of uvmSelect) {
      if (!select.contains(target)) {
        select.classList.remove('uvm--opened');
      }
    }
  });

  for (const input of uvmInput) {
    input.addEventListener('input', event => {
      const { value } = event.target;

      for (let i = 0; i < currentSelect.length; i++) {

        if (!currentSelect[i].innerText.
            toLowerCase().trim().includes(value.toLowerCase().trim())) {
          currentSelect[i].style.display = 'none';
        }
        else {
          currentSelect[i].style.display = 'flex';
        }
      }
    });
  }

});
