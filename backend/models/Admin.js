const db = require("../config/db");

const Admin = {
    async findByUsername(username) {
        const [rows] = await db.query(
            "SELECT * FROM admin WHERE admin_user = ?",
            [username]
        );
        return rows[0] || null;
    },

    async getProfileImage(id) {
    const [rows] = await db.query(
        "SELECT profile_image FROM admin WHERE admin_id = ?",
        [id]
    );

    return rows[0];
},

        async updateProfile(id, name, email, school, phone, profileImage = null) {

            let sql = `
                UPDATE admin
                SET
                    admin_name = ?,
                    admin_email = ?,
                    admin_school = ?,
                    admin_phone = ?
            `;

            const values = [name, email, school, phone];

            if (profileImage) {
                sql += `, profile_image = ?`;
                values.push(profileImage);
            }

            sql += ` WHERE admin_id = ?`;

            values.push(id);

            const [result] = await db.query(sql, values);

            return result;
        },
        
        async findById(id) {
            const [rows] = await db.query(
                `SELECT admin_password
                FROM admin
                WHERE admin_id = ?`,
                [id]
            );

            return rows[0] || null;
        },

        async updatePassword(id, hashedPassword) {
            const [result] = await db.query(
                `UPDATE admin
                SET admin_password = ?
                WHERE admin_id = ?`,
                [hashedPassword, id]
            );

            return result;
        }
};



module.exports = Admin;