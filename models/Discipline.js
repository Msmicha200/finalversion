const Database = require('../components/Database');

module.exports = class Discipline {

    static addDiscipline (title) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Disciplines(
                                Title
                            )
                        VALUES(?)`;

        return db.query(sql, [title]);
    }

    static getForSt (id) {
        const db = Database.getConnection();
        const sql = `SELECT
                    d.Title
                FROM
                    Accounts AS a
                INNER JOIN
                    Groups AS g
                ON
                    g.Id = a.GroupId
                INNER JOIN
                    DisciplineToGroup AS dtg
                ON
                    dtg.GroupId = a.GroupId
                    INNER JOIN
                    DisciplineToTeacher AS dtt
                ON
                    dtg.DisciplineTeacherId = dtt.Id
                INNER JOIN
                    Disciplines AS d
                ON
                    d.Id = dtt.DisciplineId
                WHERE
                    a.Id = ? AND dtg.Passed = 0`;
        
        return db.query(sql, [id]);
    }

    static getDisciplines (groupId = false, teacherId = false) {
        const db = Database.getConnection();
        let sql = '';
        
        if (groupId) {
            sql = `SELECT
                    dg.Id,
                    d.Title,
                    dg.Passed
                FROM
                    DisciplineToGroup AS dg
                INNER JOIN DisciplineToTeacher AS dt
                ON
                    dg.DisciplineTeacherId = dt.Id
                INNER JOIN Disciplines AS d
                ON
                    dt.DisciplineId = d.Id
                WHERE
                    dg.GroupId = ?`;
        
            return db.query(sql, [groupId]);
        }
        else if (teacherId) {
            sql = `SELECT
                    d.Id,
                    d.Title
                FROM
                    Disciplines AS d
                INNER JOIN DisciplineToTeacher AS dt
                ON
                    dt.DisciplineId = d.Id
                WHERE
                    dt.TeacherId = ?`;

            return db.query(sql, [teacherId]);
        }

        sql = `SELECT
                    *
                FROM
                    Disciplines`;

        return db.query(sql);
    }

    static editDiscipline (id, title) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Disciplines
                    SET
                        Title = ?
                    WHERE
                        Id = ?`;
        const data = [title, id];

        return db.query(sql, data);
    }

    static addToGroup (teacherId, groupId, disciplineId) {
        const db = Database.getConnection();
        const sql = `INSERT INTO DisciplineToGroup
            (DisciplineTeacherId, GroupId)
                        VALUES(
                            (
                            SELECT
                                Id
                            FROM
                                DisciplineToTeacher
                            WHERE
                                TeacherId = ? AND DisciplineId = ?
                        ),
                        ?
                        )`;
        const data = [teacherId, disciplineId, groupId];

        return db.query(sql, data);
    }

    static editToGroup (id, groupId, disciplineId) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        DisciplineToGroup
                    SET
                        GroupId = ?,
                        DisciplineId = ?
                    WHERE
                        Id = ?`;
        const data = [groupId, disciplineId, id];

        return db.query(sql, data);
    }

    static changePassed (id, status, groupId) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        DisciplineToGroup
                    SET
                        Passed = ?
                    WHERE
                        Id = ? AND GroupId = ?`
        const data = [status, id, groupId];

        return db.query(sql, data);
    }

    static getTeachers (disciplineId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        a.Id,
                        a.FirstName,
                        a.LastName,
                        a.MiddleName
                    FROM
                        Accounts AS a
                    INNER JOIN DisciplineToTeacher AS dt
                    ON
                        a.Id = dt.TeacherId AND dt.DisciplineId = ?`;

        return db.query(sql, [disciplineId]);
    }

    static addToTeacher (teacherId, disciplineId) {
        const db = Database.getConnection();
        const sql = `INSERT INTO DisciplineToTeacher
            (TeacherId, DisciplineId) VALUES(?, ?)`;
        const data = [teacherId, disciplineId];

        return db.query(sql, data);
    }

}
