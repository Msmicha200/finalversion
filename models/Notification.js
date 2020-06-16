const Database = require('../components/Database');

module.exports = class Notification {
    static sendNotification (groupId, disciplineId, text) {
        const db = Database.getConnection();
        const sql = `INSERT
                        INTO
                            Notifications(DisciplineId, GroupId, Text)
                        VALUES(?, ?, ?)`;
        const data = [disciplineId, groupId, text];

        return db.query(sql, data);
    }

    static getNotifications (groupId, disciplineId) {
        const db = Database.getConnection();
        const sql = `SELECT
                        *
                    FROM
                        Notifications
                    WHERE
                        DisciplineId = ? AND GroupId = ?`;
        const data = [disciplineId, groupId];

        return db.query(sql, data);
    }

    static watched (id) {
        const db = Database.getConnection();
        const sql = `DELETE
                        FROM
                            Notifications
                        WHERE
                            Id = ?`;

        return db.query(sql, [id]);
    }

}
