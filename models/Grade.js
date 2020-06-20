const Database = require('../components/Database');

module.exports = class Grade {
    static getStudents (groupId = false, id = false) {
        const db = Database.getConnection();
        let sql = ``;

        if (groupId) {
            sql = `SELECT
                        Id,
                        LastName,
                        FirstName,
                        MiddleName
                    FROM
                        Accounts
                    WHERE
                        GroupId = ? AND IsActive = 1`

            return db.query(sql, [groupId]);        
        }
        else if (id) {
            sql = `SELECT
                        a.Id,
                        a.LastName,
                        a.FirstName,
                        a.MiddleName,
                        a.GroupId,
                        g.Title
                    FROM
                        Accounts AS a
                    INNER JOIN Groups AS g
                    ON
                        a.GroupId = g.Id
                    WHERE
                        a.Id = ?`;

            return db.query(sql, [id]);
        }
    }

    static getForSt (studentId) {
        const db = Database.getConnection();
    }

    static getNonActive (groupId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        Id
                    FROM
                        Accounts
                    WHERE
                        GroupId = ? AND IsActive = 0`;
        
        return db.query(sql, [groupId]);
    }

    static getGrades (groupId = false, lessonId = false, stId = false) {
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
                        g.Id,
                        g.StudentId,
                        g.Grade
                    FROM
                        Grades AS g
                    INNER JOIN
                        Accounts AS a
                    ON
                        a.Id = g.StudentId
                    WHERE
                        LessonId = ? AND a.IsActive = 1`;
            data.push(lessonId);
        }
        else if (stId.disciplId && stId.Id) {
            sql = `SELECT
                        g.Id,
                        l.Id AS LessonId,
                        g.Grade,
                        g.StudentId
                    FROM
                        Grades AS g
                    INNER JOIN Lessons AS l
                    ON
                        l.Id = g.LessonId
                    WHERE
                        g.StudentId = ? AND l.DisciplineId = ?`;
            
            data.push(stId.Id, stId.disciplId);
        }

        return db.query(sql, data);
    }

    static bind (students, lessons, grades) {
        console.log(grades);
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

    static setGrade (studentId, gradeId, grade) {
        const db = Database.getConnection();
        if (Number.isNaN(grade)) {
            grade = 2;
        }
        const sql = `UPDATE
                        Grades
                    SET
                        Grade = ?
                    WHERE
                        StudentId = ? AND Id = ?`;
        const data = [grade, studentId, gradeId];

        return db.query(sql, data);
    }

    static getAvgTheme (studentId, disciplineId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        ROUND(AVG(g.Grade)) AS gr
                    FROM
                        Grades AS g
                    INNER JOIN
                        Lessons AS l
                    ON
                        g.LessonId = l.Id
                    INNER JOIN
                        Accounts AS a
                    ON
                        a.Id = g.StudentId
                    WHERE
                        l.Datetime >(
                        SELECT DATETIME
                    FROM
                        Lessons
                    WHERE
                        LessonTypeId = 7
                    ORDER BY DATETIME
                    DESC
                    LIMIT 1) 
                    AND g.StudentId = ? 
                    AND l.DisciplineId = ? 
                    AND l.LessonTypeId != 7 
                    AND l.LessonTypeId != 8 
                    AND l.lessonTypeId != 1 
                    AND g.Grade != 1 
                    AND a.IsActive = 1`;
        const data = [studentId, disciplineId];

        return db.query(sql, data);
    }

    static async getSem (studentId, disciplineId, groupId, lessonId) {
        const db = Database.getConnection();
        let first = `SELECT
                        l.Datetime
                    FROM
                        Grades AS g
                    INNER JOIN Lessons AS l
                    ON
                        g.LessonId = l.Id
                    WHERE
                        l.LessonTypeId = 8
                    AND
                        l.DisciplineId = ?
                    AND
                        g.StudentId = ?
                    AND
                        l.GroupId = ?
                    AND
                        l.Id != ?`;
        let second = `SELECT
                        g.Grade
                    FROM
                        Grades AS g
                    INNER JOIN Lessons AS l
                    ON
                        g.LessonId = l.Id
                    WHERE
                        l.DisciplineId = ?
                        AND LessonTypeId IN (2, 7)
                        AND g.StudentId = ?
                        AND l.GroupId = ?
                        AND DATETIME > ?
                        AND (g.Grade != 1 OR g.Grade IS NULL OR g.Grade != -1)
                    ORDER BY
                        g.Id`;

        const data = [ disciplineId, studentId, groupId ];

        const [ firstGrades ] = await db.query(first, [...data, lessonId]);
        let minDate = new Date('1970-05-05');

        if (firstGrades.length) {
            minDate = firstGrades[0].Datetime;  
        }

        data.push(minDate);

        const [ grades ] = await db.query(second, data);

        let isValid = true;
        let sum = 0;
        let avg = 0;

        for (let i = 0; i < grades.length-1; i += 2) {
            const grade = Math.max(grades[i].Grade, grades[i + 1].Grade);
            sum += grade;
            
            if (grade <= 2) {
                isValid = false;
            }                
        }

        if (isValid) {
            avg = Math.round(sum / (grades.length / 2));
        }
        else {
            avg = 0;
        }

        return avg;
    }

    static report (disciplineId, groupId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        (
                        SELECT
                            CONCAT(
                                LastName,
                                ' ',
                                FirstName,
                                ' ',
                                MiddleName
                            )
                        FROM
                            Accounts AS u
                        WHERE
                            u.Id = g.StudentId
                    ) AS Student,
                    r.Grade,
                    dp.Title,
                    l.Datetime,
                    (
                    SELECT
                        CONCAT(
                            LastName,
                            ' ',
                            FirstName,
                            ' ',
                            MiddleName
                        )
                    FROM
                        Accounts AS u
                    WHERE
                        u.Id = dtt.TeacherId
                    ) AS Teacher
                    FROM
                        Report AS r
                    INNER JOIN
                        Grades AS g
                    ON
                        r.GradeId = g.Id
                    INNER JOIN
                        Lessons AS l
                    ON
                        g.LessonId = l.Id
                    INNER JOIN
                        DisciplineToGroup AS dtg
                    ON
                        dtg.GroupId = l.GroupId
                    INNER JOIN
                        DisciplineToTeacher AS dtt
                    ON
                        dtt.Id = dtg.DisciplineTeacherId
                    INNER JOIN
                        Disciplines AS dp
                    ON
                        l.DisciplineId = dp.Id
                    WHERE
                        l.DisciplineId = 2 AND 
                        l.GroupId = 1 AND 
                        dtt.DisciplineId = l.DisciplineId AND 
                        dtg.GroupId = l.GroupId
                    ORDER BY
                        r.Datetime`;
        const data = [disciplineId, groupId];
        
        return db.query(sql, data);
    }
}