console.warn("errror")
process.exit(0)
import mongoose from "mongoose";
import connectDb from "./src/config/db";
async function create() {
	try {
		await connectDb();
		console.log(
			await mongoose.connection
				.useDb("vercel")
				.collection("projects")
				.find({ status: { $eq: "NOT_STARTED" } })
				.toArray(),
		);
	} catch (error) {
		console.log(error);
	}
}

create();
