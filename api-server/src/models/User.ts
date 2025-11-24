import mongoose, { Document, Schema, Types } from "mongoose";
import { IPlans, PLANS } from "../constants/plan.js";

export interface IUser extends Document {
	_id: string;
	name: string;
	email: string;
	profileImage: string;
	googleId: string;
	plan: keyof IPlans;
	projects: number;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		profileImage: { type: String, required: true },
		googleId: { type: String, required: true, unique: true },
		plan: { type: String, required: true, default: "FREE" },
		projects: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
