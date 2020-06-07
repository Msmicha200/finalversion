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

    static getDisciplines (groupId = false, teacherId = false) {
        const db = Database.getConnection();
        let sql = '';
        
        if (groupId) {
            sql = `SELECT
                    dt.Id,
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

    static changePassed (id, status) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        DisciplineToGroup
                    SET
                        Passed = ?
                    WHERE
                        Id = ?`
        const data = [status, id];

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
