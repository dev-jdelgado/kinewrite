const db = require("../config/db");

const Admin = {
    async findByUsername(username) {
        const { rows } = await db.query(
            "SELECT * FROM admin WHERE admin_user = $1",
            [username]
        );
        return rows[0] || null;
    },

    async getProfileImage(id) {
        const { rows } = await db.query(
            "SELECT profile_image FROM admin WHERE admin_id = $1",
            [id]
        );
        return rows[0] || null;
    },

    async updateProfile(id, name, email, school, phone, profileImage = null) {
        let sql = `
            UPDATE admin
            SET
                admin_name = $1,
                admin_email = $2,
                admin_school = $3,
                admin_phone = $4
        `;

        const values = [name, email, school, phone];

        if (profileImage) {
            sql += `, profile_image = $5 WHERE admin_id = $6`;
            values.push(profileImage, id);
        } else {
            sql += ` WHERE admin_id = $5`;
            values.push(id);
        }

        const result = await db.query(sql, values);
        return result;
    },

    async findById(id) {
        const { rows } = await db.query(
            `
            SELECT admin_password
            FROM admin
            WHERE admin_id = $1
            `,
            [id]
        );
        return rows[0] || null;
    },

    async updatePassword(id, hashedPassword) {
        return await db.query(
            `
            UPDATE admin
            SET admin_password = $1
            WHERE admin_id = $2
            `,
            [hashedPassword, id]
        );
    }
};

module.exports = Admin;
