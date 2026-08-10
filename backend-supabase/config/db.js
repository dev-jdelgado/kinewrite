const { Pool } = require("pg");
require("dotenv").config();

/**
 * KineWrite PostgreSQL connection pool.
 *
 * Supabase provides PostgreSQL. For Render, use the Supabase
 * Session Pooler DATABASE_URL because Render is IPv4 based.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL is not configured.");
}

const pool = new Pool({
    connectionString,
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("error", (error) => {
    console.error("❌ Unexpected PostgreSQL pool error:", error.message);
});

async function testConnection() {
    if (!connectionString) return;

    try {
        const client = await pool.connect();
        try {
            await client.query("SELECT 1");
            console.log("✅ Supabase PostgreSQL Connected");
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
}

testConnection();

module.exports = pool;
