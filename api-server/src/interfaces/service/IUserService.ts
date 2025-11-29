import { Profile } from "passport";
import { IUser } from "../../models/User.js";

export interface IUserSerivce {
	findUser(googleId: string, email: string): Promise<IUser | null>;
	createUser(userData: Partial<IUser>): Promise<IUser>;

	googleLoginStrategy(Profile: Profile): Promise<IUser>;
	githubLoginStrategy(profile: Profile): Promise<IUser>
	updateUser?(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
	updateUserProfile?(userId: string): Promise<IUser | null>;

	getUser(userId: string): Promise<IUser | null>
	getUserDetailed(userId: string): Promise<{ user: IUser | null; bandwidth: number; }>
	userCanDeploy(userId: string): Promise<{ user: IUser | null, limit: number, allowed: boolean, remaining: number }>

}
