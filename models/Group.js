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

    static getGroups (params) {
        const db = Database.getConnection();
        let sql = '';

        if (params) {
            const course = params.course || 0;
            const specId = params.specId || 0;

            sql = `SELECT
                        Id,
                        Title
                    FROM
                        Groups
                    WHERE
                        Course = ? AND SpecialityId = ?`;

            const data = [params.course, params.specId];
            
            return db.query(sql, data);
        }

        sql = `SELECT
                    g.Id,
                    g.CuratorId,
                    g.Title,
                    a.LastName,
                    a.FirstName,
                    a.MiddleName,
                    g.Course
                FROM
                    Groups AS g
                INNER JOIN
                    Accounts AS a
                ON
                    g.CuratorId = a.Id`;

        return db.query(sql);
    }

    static getSpecialities () {
        const db = Database.getConnection();
        const sql = `SELECT
                        *
                    FROM
                        Specialities`;

        return db.query(sql);
    }
}
