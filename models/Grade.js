const Database = require('../components/Database');

module.exports = class Discipline {
    static getStudents (groupId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        Id,
                        LastName,
                        FirstName,
                        MiddleName
                    FROM
                        Accounts
                    WHERE
                        GroupId = ?`;

        return db.query(sql, [groupId]);
    }

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
                        l.GroupId = ? AND l.DisciplineId = ?`;

        return db.query(sql, [groupId, disciplineId]);
    }

    static getGrades (groupId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        g.Id,
                        g.Grade,
                        l.Id AS LessonId,
                        g.StudentId
                    FROM
                        Grades AS g
                    INNER JOIN Lessons AS l
                    ON
                        g.LessonId = l.Id
                    WHERE
                        l.GroupId = ?`;

        return db.query(sql, [groupId]);
    }

    static bind(students, lessons, grades) {
        for (const student of students) {
            student['grades'] = [];
            for (const lesson of lessons) {
                const grade = grades.find(grade => grade.StudentId == student.Id
                    && grade.LessonId == lesson.Id);

                student.grades.push(grade);
            }
        }

        return new Promise((resolve, reject)=> {
            resolve({students, lessons});
        });
    }

    static setGrade(studentId, gradeId, grade) {
        const db = Database.getConnection();
        const sql = `UPDATE
                        Grades
                    SET
                        Grade = ?
                    WHERE
                        StudentId = ? AND Id = ?`;
        const data = [grade, studentId, gradeId];

        return db.query(sql, data);
    }
}