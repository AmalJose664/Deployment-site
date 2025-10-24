import mongoose, { Document, Schema, Types } from "mongoose";

export enum DeploymentStatus {
	NOT_STARTED = "NOT_STARTED",
	QUEUED = "QUEUED",
	BUILDING = "BUILDING",
	READY = "READY",
	FAILED = "FAILED",
	CANCELED = "CANCELLED",
}
export interface IDeployment extends Document {
	_id: string;
	project: Types.ObjectId;
	commit_hash: string;
	userId: Types.ObjectId;
	status: DeploymentStatus;
	install_ms: number;
	build_ms: number;
	duration_ms: number;
	overWrite: boolean;
	complete_at: Date;
	s3Path: string;
	error_message?: string;
	createdAt: Date;
	updatedAt: Date;
}
const deploymentSchema = new Schema<IDeployment>(
	{
		project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		status: { type: String, enum: Object.values(DeploymentStatus), default: DeploymentStatus.NOT_STARTED },
		s3Path: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		commit_hash: { type: String, required: true },
		install_ms: { type: Number, default: 0 },
		build_ms: { type: Number, default: 0 },
		overWrite: { type: Boolean, required: true },
		error_message: { type: String },
		duration_ms: { type: Number, default: 0 },
		complete_at: { type: Date, },
	},
	{ timestamps: true },
);

export const Deployment = mongoose.model<IDeployment>("Deployment", deploymentSchema);
