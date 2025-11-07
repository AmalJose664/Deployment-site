import { IUserRepository } from "../interfaces/repository/IUserRepository.js";
import { IUser, User } from "../models/User.js";
import { BaseRepository } from "./base/base.repository.js";
import { IPlans, PLANS } from "../constants/plan.js";
import { Types } from "mongoose";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
    constructor() {
        super(User);
    }
    async createUser(data: Partial<IUser>): Promise<IUser> {
        return await super.create(data);
    }
    async findByUserId(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }
    async findByEmailOrGoogleId(email: string, googleId: string): Promise<IUser | null> {
        return await User.findOne({ $or: [{ googleId }, { email }] });
    }
    async findByUserEmail(email: string): Promise<IUser | null> {
        return await this.findOne({ email });
    }

    async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }
    async incrementProjects(userId: Types.ObjectId | string): Promise<void> {
        await User.updateOne({ _id: userId }, { $inc: { projects: 1 } });
    }
    async decrementProjects(userId: Types.ObjectId | string): Promise<void> {
        await User.updateOne({ _id: userId }, { $inc: { projects: -1 } });
    }

    async updateUserPlans(userId: string, planData: IPlans[keyof IPlans]): Promise<IUser | null> {
        return await User.findOneAndUpdate({ _id: userId }, { $set: { plan: planData } }, { new: true });
    }
}

export default UserRepository;
