const Database = require('../components/Database');

module.exports = class Discipline {

    static addDiscipline (title, teacherId) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Disciplines(
                                Title, 
                                TeacherId
                            )
                        VALUES(?, ?)`;
        const data = [title, teacherId];

        return db.query(sql, data);
    }

    static getDisciplines (groupId = false) {
        const db = Database.getConnection();
        let sql = '';
        
        if (groupId) {
            sql = `SELECT
                        d.Id,
                        d.Title,
                        dg.Passed
                    FROM
                        Disciplines AS d,
                        DisciplineToGroup AS dg
                    WHERE
                        dg.GroupId = ? AND d.Id = dg.DisciplineId`
        
            return db.query(sql, [groupId]);
        }

        sql = `SELECT
                    d.Id,
                    d.Title,
                    a.LastName,
                    a.FirstName,
                    a.MiddleName,
                    dt.TeacherId
                FROM
                    Disciplines AS d
                INNER JOIN
                    DisciplineToTeacher AS dt
                ON
                    d.Id = dt.DisciplineId
                INNER JOIN
                    Accounts AS a
                ON
                    dt.TeacherId = a.Id`;

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

    static addToGroup (groupId, disciplineId) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            DisciplineToGroup(
                                DisciplineId, 
                                GroupId
                            )
                        VALUES(?, ?)`;
        const data = [DisciplineId, disciplineId];

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



}
