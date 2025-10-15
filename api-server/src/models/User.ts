import mongoose, { Document, Schema, Types } from "mongoose";
import { IPlans, PLANS } from "../constants/plan.js";

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    profileImage: string;
    googleId: string;
    plan: IPlans[keyof IPlans];
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
        plan: {
            name: { type: String, required: true, default: PLANS.FREE.name },
            slug: { type: String, required: true, default: PLANS.FREE.slug },
            pricePerMonth: { type: Number, required: true, default: PLANS.FREE.pricePerMonth },
            maxProjects: { type: Number, required: true, default: PLANS.FREE.maxProjects },
            customDomains: { type: Boolean, required: true, default: PLANS.FREE.customDomains },
            features: { type: [String], default: PLANS.FREE.features },
        },
        projects: { type: Number, required: true, default: 0 },
    },
    { timestamps: true },
);

export const User = mongoose.model<IUser>("User", userSchema);
