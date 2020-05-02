const Database = require('../components/Database');

module.exports = class Group {

    static addGroup (title, specialityId, curatorId, course) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Groups(
                                Title,
                                SpecialityId,
                                CuratorId,
                                Course
                            )
                        VALUES(?, ?, ?, ?)`;
        const data = [title, specialityId, curatorId, course];

        return db.query(sql, data);
    }

    static editGroup (id, title, specialityId, curatorId, course) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Groups
                    SET
                        Title = ?,
                        SpecialityId = ?,
                        CuratorId = ?,
                        Course = ?
                    WHERE
                        Id = ?`;
        const data = [title, specialityId, curatorId, course, id];

        return db.query(sql, data);
    }

    static getGroups () {
        const db = Database.getConnection();
        const sql = `SELECT * FROM groups`;

        return db.query(sql, db);
    }
}