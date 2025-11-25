import { Types } from "mongoose";
import { IUser } from "../../models/User.js";
import { IPlans } from "../../constants/plan.js";

export interface IUserRepository {
	createUser(data: Partial<IUser>): Promise<IUser>;
	findByUserEmail(email: string): Promise<IUser | null>;
	findByUserId(id: string): Promise<IUser | null>;
	incrementProjects(userId: Types.ObjectId | string): Promise<void>;
	decrementProjects(userId: Types.ObjectId | string): Promise<void>;
	updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
	findByEmailOrGoogleId(email: string, googleId: string): Promise<IUser | null>;
	updateUserPlans(userId: string, planData: keyof IPlans): Promise<IUser | null>
	getOrUpdateDeployments(userId: string): Promise<IUser | null>
	incrementDeployment(userId: string): Promise<void>
}
