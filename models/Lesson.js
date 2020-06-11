const Database = require('../components/Database');

module.exports = class Lesson {
    static getLessons (groupId, disciplineId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        l.Id,
                        lt.Title,
                        l.Datetime
                    FROM
                        Lessons AS l
                    INNER JOIN LessonTypes AS lt
                    ON
                        l.LessonTypeId = lt.Id
                    WHERE
                        l.GroupId = ? AND l.DisciplineId = ?
                    ORDER BY DATETIME`;

        return db.query(sql, [groupId, disciplineId]);
    }

    static addLesson (groupId, disciplineId, lessonTypeId) {
        const db = Database.getConnection();
        const sql = `INSERT INTO Lessons(
                        DisciplineId,
                        GroupId,
                        LessonTypeId
                    )
                    VALUES(?, ?, ?)`;
        const data = [disciplineId, groupId, lessonTypeId];

        return db.query(sql, data);
    }
}