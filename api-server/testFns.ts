import { Deployment } from "./src/models/Deployment"
import { Project } from "./src/models/Projects"
import mongoose, { Types } from "mongoose";
import connectDb from "./src/config/db";
async function create() {
	try {
		// await connectDb();
		console.log(new Types.ObjectId("54fjkn5j4n53kj5n2kj4n2j"))
		// await mongoose.disconnect()
	} catch (error) {
		console.log(error);
	} finally {
		process.exit(0)
	}
}

create();
