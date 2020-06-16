const Database = require('../components/Database');

module.exports = class Group {

    static addGroup (title, specialityId, curatorId, course) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Groups(
                                Title,
                                SpecialityId,
                                CuratorId
                            )
                        VALUES(?, ?, ?)`;
        const data = [title, specialityId, curatorId];

        return db.query(sql, data);
    }

    static editGroup (id, title, specialityId, curatorId) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Groups
                    SET
                        Title = ?,
                        SpecialityId = ?,
                        CuratorId = ?
                    WHERE
                        Id = ?`;
        const data = [title, specialityId, curatorId, id];

        return db.query(sql, data);
    }

    static getGroups (params = false, disciplineId = false, teacherId = false) {
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
        else if (disciplineId && teacherId) {
            sql = `SELECT
                        g.Id,
                        g.Title
                    FROM
                        Groups AS g
                    INNER JOIN
                        DisciplineToGroup AS dg
                    ON
                        dg.GroupId = g.Id
                    INNER JOIN
                        DisciplineToTeacher AS dt
                    ON
                        dg.DisciplineTeacherId = dt.Id
                    WHERE
                        dt.DisciplineId = ? AND dg.Passed = 0 AND dt.TeacherId = ?`;

            return db.query(sql, [disciplineId, teacherId]);
        }

        sql = `SELECT
                    g.Id,
                    g.CuratorId,
                    g.Title,
                    a.LastName,
                    a.FirstName,
                    a.MiddleName,
                    s.Id AS SpecId,
                    g.Course
                FROM
                    Groups AS g
                INNER JOIN Accounts AS a
                ON
                    g.CuratorId = a.Id
                INNER JOIN Specialities AS s
                ON
                    s.Id = g.SpecialityId;`;

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
