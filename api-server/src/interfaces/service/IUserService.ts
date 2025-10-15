import { Profile } from "passport";
import { IUser } from "../../models/User.js";

export interface IUserSerivce {
    findUser(googleId: string, email: string): Promise<IUser | null>;
    createUser(userData: Partial<IUser>): Promise<IUser>;

    googleLoginStrategy(Profile: Profile): Promise<IUser>;
    updateUser?(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    updateUserProfile?(userId: string): Promise<IUser | null>;
}
