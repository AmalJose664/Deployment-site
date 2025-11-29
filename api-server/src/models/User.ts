import mongoose, { Document, Schema, Types } from "mongoose";
import { IPlans, } from "../constants/plan.js";
export enum AuthProvidersList {
	GOOGLE = "google",
	GITHUB = "github",
}
export interface IUser extends Document {
	_id: string;
	name: string;
	email: string;
	profileImage: string;
	authProviders: { provider: AuthProvidersList, id: string }[]
	plan: keyof IPlans;
	projects: number;
	deploymentsToday: number
	currentDate: string;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		profileImage: { type: String, required: true },
		authProviders: [{
			provider: { type: String, enum: Object.values(AuthProvidersList) },
			id: { type: String, required: true },
			_id: false
		}],
		plan: { type: String, required: true, default: "FREE" },
		projects: { type: Number, required: true, default: 0 },
		deploymentsToday: { type: Number, required: true, default: 0 },
		currentDate: { type: String, required: true, default: () => new Date().toISOString().slice(0, 10) }
	},
	{ timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
