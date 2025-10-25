import { Deployment } from "./src/models/Deployment"
import { Project } from "./src/models/Projects"
import repo from "./src/repositories/project.repository"
import mongoose, { Types } from "mongoose";
import connectDb from "./src/config/db";
import pg from "pg"
async function create() {
	try {
		await connectDb();
		await Project.updateOne({ _id: "68fb1ccb10b93de245fa9f55" }, { deployments: [] })
		// console.log(await Deployment.deleteMany())
		// const r = await new repo().pullDeployments("68fa78e47e6c4401f35402d8", "68e4a04f1e57fa3fe5b1a81e", "68fa79c47e6c4401f35402f2")

		// await mongoose.disconnect()
	} catch (error) {
		console.log(error);
	} finally {
		process.exit(0)
	}
}

// create();
async function main() {

	const { Pool } = pg;
	const pool = new Pool({
		connectionString: "postgres://tsdbadmin:rfncnunbzyd4bmf4@bzwcde53qk.i2vg267re8.tsdb.cloud.timescale.com:32460/tsdb"
	})
	await pool.connect()
	const res = await pool.query('SELECT NOW()');
	console.log(res, res.rows)

}

main()