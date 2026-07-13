const db = require("../config/db");

const Admin = {
    async findByUsername(username) {
        const [rows] = await db.query(
            "SELECT * FROM admin WHERE admin_user = ?",
            [username]
        );
        return rows[0] || null;
    },
    async updateProfile(id, name, email, school, phone) {
        const [result] = await db.query(
            `UPDATE admin
             SET admin_name = ?,
                 admin_email = ?,
                 admin_school = ?,
                 admin_phone = ?
             WHERE admin_id = ?`,
            [name, email, school, phone, id]
        );

        return result;
    }
};

module.exports = Admin;