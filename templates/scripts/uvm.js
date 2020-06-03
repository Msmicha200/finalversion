'use strict';

class uvm {

  static dataToObj (formData) {
    const obj = {};

    for (const [key, value] of formData.entries()) {
      obj[key] = value;
    }

    return obj;
  }

  static ajax(options) {
    return new Promise((resolve, reject) => {
      const type = options.type.toString();
      const url = (options.url.toString() || '');
      const dataType = (options.dataType || 'text');
      const data = (options.data || {});
      const request = new XMLHttpRequest();
      let chunk = '';

      for (const value in data) {
        chunk += value.toString() + '=' + data[value] + "&";
      }

      request.open(type, url, true);
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      request.withCredentials = (options.credentials || false);
      request.responseType = dataType.toString();

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request.response);
        }
        else {
          reject(request.statusText);
        }
      }

      request.onerror = () => reject(request.statusText);
      request.send(chunk);
    });
  }

  static q (selector) {
    return document.querySelector(selector);
  }

  static byId (id) {
    return document.getElementById(id)
  }

  static qa (selector) {
    return document.querySelectorAll(selector);
  }

  static qe (element, selector) {
    return element.querySelector(selector);
  }

  static qae (element, selector) {
    return element.querySelectorAll(selector);
  }

  static ce (tag) {
    return document.createElement(tag)
  }

  static selectErr (elem) {
    elem.classList.add('uvm--select-error');

    setTimeout(() => {
        elem.classList.remove('uvm--select-error')
    }, 1500);
  }

  static valid (inputs, checkPass = true) {
    let isCorrect = true;
    const timeout = 1500;
    const regex = {
        firstName: /^[А-я]{2,50}$/,
        lastName: /^[А-я]{2,50}$/,
        middleName: /^[А-я]{2,50}$/,
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        number: /^[0-9]{6,20}$/,
        login: /^[A-z0-9]{3,64}$/,
        password: /^.{6,64}$/,
        groupTitle: /^[А-я0-9\-]{3,64}$/,
        title: /^[А-я0-9\-]{3,256}$/,
        theme: /^.{6,512}$/
    };

    for (const input of inputs) {
      if (!regex[input.getAttribute('name')].test(input.value)) {
            if (input.getAttribute('name') === 'password' && !checkPass) {
              continue;
            }

            input.classList.add('error');
            isCorrect = false;

            setTimeout(() => {
                input.classList.remove('error');
                isCorrect = true;
            }, 1500);        
      }
    }

    return isCorrect;
  }
}
