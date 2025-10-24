import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEnvVar {
	name: string;
	value: string;
}
export enum ProjectStatus {
	NOT_STARTED = "NOT_STARTED",
	QUEUED = "QUEUED",
	BUILDING = "BUILDING",
	READY = "READY",
	FAILED = "FAILED",
	CANCELED = "CANCELLED",
}
export interface IProject extends Document {
	_id: string;
	user: Types.ObjectId;
	name: string;
	repoURL: string;
	subdomain: string;
	buildCommand: string;
	installCommand: string;
	branch: string;
	rootDir: string;
	outputDirectory: string;
	env: IEnvVar[];
	lastDeployedAt?: Date;
	status: ProjectStatus;
	deployments?: Types.ObjectId[];
	isDeleted: boolean;

	createdAt: Date;
	updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		name: { type: String, required: true },
		repoURL: { type: String, required: true },
		subdomain: { type: String, required: true, unique: true },
		buildCommand: { type: String, required: true, default: "build" },
		branch: { type: String, required: true, default: "main" },
		rootDir: { type: String, required: true, default: "/" },
		installCommand: { type: String, required: true, default: "npm install" },
		outputDirectory: { type: String, required: true, default: "dist" },
		env: [{ name: String, value: String }],
		lastDeployedAt: { type: Date, default: Date.now() },
		isDeleted: { type: Boolean, default: false },
		status: {
			type: String,
			required: true,
			enum: Object.values(ProjectStatus),
			default: ProjectStatus.NOT_STARTED,
		},
		deployments: [{ type: Schema.Types.ObjectId, ref: "Deployment" }],
	},
	{
		timestamps: true,
	},
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
