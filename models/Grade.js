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

    static getGrades (groupId = false, lessonId = false) {
        const db = Database.getConnection();
        const data = [];
        let sql = '';

        if (groupId) {
            sql = `SELECT
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
            data.push(groupId);
        }
        else if (lessonId) {
            sql = `SELECT
                        Id,
                        Grade
                    FROM
                        Grades
                    WHERE
                        LessonId = ?`;
            data.push(lessonId);
        }

        return db.query(sql, data);
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