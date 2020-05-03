const Database = require('../components/Database');
const Mail = require('../components/Mail.js');
const crypto = require('crypto');

module.exports = class User {

    static getHash (data) {
        const hash = crypto.createHash('sha512');
        
        hash.update(data);
        
        return hash.digest('hex');
    }

    static generateToken (length = 10) {
        const symbols = '@!#$~%~^~&*(!)qwertyuiopasdfghjk;kl@@#!$%^%@';
        const date = new Date();
        let token = '';
        
        for (let i = 0; i <= length; i++) {
            token += symbols[Math.random(symbols.length)];
        }

        token += date.getDay();
        token += date.getHours();
        token += date.getMilliseconds();
        token += date.getMinutes();
        token = this.getHash(token);

        return token;
    }

    static getUsers () {
        const db = Database.getConnection();
        const sql = `SELECT
                        a.Id,
                        a.LastName,
                        a.FirstName,
                        a.MiddleName,
                        a.Login,
                        a.Email,
                        a.PhoneNumber,
                        u.Title AS UserType,
                        g.Title AS GroupTitle,
                        a.IsActive
                    FROM
                        Accounts AS a
                    INNER JOIN
                        UserTypes AS u
                    ON
                        a.UserTypeId = u.Id
                    LEFT JOIN
                        Groups AS g
                    ON
                        a.GroupId = g.Id;`;

        return db.query(sql); 
    }

    static addUser (lastName, firstName, middleName, login, 
        email, phoneNumber, password, userTypeId, groupId) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Accounts(
                                LastName,
                                FirstName,
                                MiddleName,
                                Login,
                                Email,
                                PhoneNumber,
                                Password,
                                UserTpeId,
                                GroupId
                            )
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
        password = this.getHash(password);
    
        const data = [lastName, firstName, middleName, login, email,
            phoneNumber, password, userTypeId, groupId];
    
        return db.query(sql, data);
    }

    static editUser (id, lastName, firstName, middleName, login, 
        email, phoneNumber, password, groupId) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Accounts
                    SET
                        LastName = ?,
                        FirstName = ?,
                        MiddleName = ?,
                        Login = ?,
                        Email = ?,
                        PhoneNumber = ?,
                        Password = ?,
                        GroupId = ?
                    WHERE
                        Id = ?`;

        password = this.getHash(password);

        const data = [lastName, firstName, middleName, login, email,
            phoneNumber, password, groupId, id];

        return db.query(sql, data);
    }

    static updateStatus (id, status) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Accounts
                    SET
                        IsActive = ?
                    WHERE
                        Id = ?`;
        const data = [status, id];

        return db.query(sql, data);        
    }

    static checkUser (login, password) {
        const db = Database.getConnection();
        const sql = `SELECT
                        a.Id,
                        u.Title
                    FROM
                        Accounts as a,
                        UserTypes as u
                    WHERE
                        Login = ? AND PASSWORD = ? AND u.Id = 
                            a.UserTypeId AND a.IsActive > 0`;
        
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

        return db.query(sql, data).then(result  => {
            return Mail.sendMail(email, token);
        });
    }

    static setPassword (token, password) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Accounts
                    SET Password
                        = ?,
                        Token = NULL
                    WHERE
                        Token = ?`;

        password = this.getHash(password);

        const data = [password, token];

        return db.query(sql, data);
    }


}
