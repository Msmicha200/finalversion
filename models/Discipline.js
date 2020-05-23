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

    static getDisciplines (groupId = false) {
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

        sql = `SELECT
                    *
                FROM
                    Disciplines`;

        return db.query(sql);
    }

    static editDisciplines (id, title, teacherId) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Disciplines
                    SET
                        Title = ?,
                        TeacherId = ?
                    WHERE
                        Id = ?`;
        const data = [title, teacherId, id];

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

    static program (disciplineId, groupId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        Theme
                    FROM
                        WorkingProgram
                    WHERE
                        DisciplineId = ? AND GroupId = ?`;
        const data = [disciplineId, groupId];

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
