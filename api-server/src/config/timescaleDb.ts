import pg from "pg";

const { Pool } = pg;
const DB_URL = process.env.TIMESCALEDB_URL
if (!DB_URL) {
	throw new Error("TimeScale Db URL String not ffound")
}
const pool = new Pool({
	connectionString: DB_URL
})

pool.connect()
	.then(client => {
		console.log('✅ Connected to TimescaleDB');
		client.release();
	})
	.catch(err => console.error('❌ DB connection error:', err.stack));

export default pool;


