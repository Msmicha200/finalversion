const regex = {
    FirstName: /^[А-яа-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,50}$/,
    LastName: /^[А-яа-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,50}$/,
    MiddleName: /^[А-яа-щА-ЩЬьЮюЯяЇїІіЄєҐґ]{2,50}$/,
    Email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PhoneNumber: /^[0-9]{6,20}$/,
    Login: /^[A-z0-9]{3,64}$/,
    Password: /^.{6,64}$/,
    Title: /^[А-я0-9\-]{3,256}$/,
    Theme: /^.{6,512}$/
};
module.exports = class Tools {
    static valid (data) {
        for (const elem in data) {
            if (!regex[elem].test(data[elem])) {
                return false;
            }
        }

        return true;
    }
}