const Database = require('../components/Database');

module.exports = class Program {

    static getProgram (disciplineId, groupId) {
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

    static addTheme (disciplineId, groupId, title) {
    	const db = Database.getConnection();
    	const sql = `INSERT INTO WorkingProgram
    		(Theme, DisciplineId, GroupId)
						VALUES(?, ?, ?)`;
		const data = [title, disciplineId, groupId];

		return db.query(sql, data);
    }

}