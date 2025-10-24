import { Deployment } from "./src/models/Deployment"
import { Project } from "./src/models/Projects"
import repo from "./src/repositories/project.repository"
import mongoose, { Types } from "mongoose";
import connectDb from "./src/config/db";
async function create() {
	try {
		await connectDb();
		await Project.updateOne({ _id: "68fb1ccb10b93de245fa9f55" }, { deployments: [] })
		// const r = await new repo().pullDeployments("68fa78e47e6c4401f35402d8", "68e4a04f1e57fa3fe5b1a81e", "68fa79c47e6c4401f35402f2")

		// await mongoose.disconnect()
	} catch (error) {
		console.log(error);
	} finally {
		process.exit(0)
	}
}

create();
