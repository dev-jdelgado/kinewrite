const db = require("../config/db");

const Admin = {
    async findByUsername(username) {
        const [rows] = await db.query(
            "SELECT * FROM admin WHERE admin_user = ?",
            [username]
        );
        return rows[0] || null;
    }
};

module.exports = Admin;