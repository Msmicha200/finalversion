const Database = require('../components/Database');
const crypto = require('crypto');

class User {

    static getHash (data) {
        const hash = crypto.createHash('sha512');
        
        hash.update(data);
        
        return hash.digest('hex');
    }

    static generateToken () {
        const symbols = '@!#$~%~^~&*(!)qwertyuiopasdfghjk;kl@@#!$%^%@';
        const date = new Date();
        let token = "";
        
        for (let i = 0; i <= 10; i++) {
            token += symbols[Math.random(symbols.length)];
        }

        token += date.getDay();
        token += date.getHours();
        token += date.getMilliseconds();
        token += date.getMinutes();
        token = this.getHash(token);

        return token;
    }

    static addUser (lastName, firstName, middleName, login, 
        email, phoneNumber, password, userTypeId, groupId) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Accounts(
                                lastName,
                                firstName,
                                middleName,
                                login,
                                email,
                                phoneNumber,
                                password,
                                userTpeId,
                                groupId
                            )
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        password = this.getHash(password);
    
        const data = [lastName, firstName, middleName, login, email, 
            phoneNumber, password, userTypeId, groupId];
    
        return db.query(sql, data);            
        }

    static checkUser (login, password) {
        const db = Database.getConnection();
        const sql = `SELECT
                        Id
                    FROM
                        Accounts
                    WHERE
                        Login = ? AND PASSWORD = ?`;
        
        password = this.getHash(password);

        const data = [login, password];

        return db.query(sql, data);
    }

    static resetPassOnEmail (email) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Accounts
                    SET
                        Token = ?
                    WHERE
                        Email = ?`;
        const token = this.generateToken();
        const data = [token, email];

        db.query(sql, data).then(result  => {
            
        });
    }


}
