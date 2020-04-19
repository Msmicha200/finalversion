'use strict';

class uvm {

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

}
