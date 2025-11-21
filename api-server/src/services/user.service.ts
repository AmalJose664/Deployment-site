import { Profile } from "passport";
import { IUserRepository } from "../interfaces/repository/IUserRepository.js";
import { IUserSerivce } from "../interfaces/service/IUserService.js";
import { IUser } from "../models/User.js";
import AppError from "../utils/AppError.js";

class UserService implements IUserSerivce {
	private userRepository: IUserRepository;
	constructor(userRepo: IUserRepository) {
		this.userRepository = userRepo;
	}

	async findUser(googleId: string, email: string): Promise<IUser | null> {
		return await this.userRepository.findByEmailOrGoogleId(email, googleId);
	}
	async createUser(userData: Partial<IUser>): Promise<IUser> {
		return await this.userRepository.createUser(userData);
	}
	async googleLoginStrategy(profile: Profile): Promise<IUser> {
		const userData = {
			googleId: profile.id,
			email: profile.emails?.[0].value || "",
			name: profile.displayName,
			profileImage: profile.photos?.[0].value,
		};
		let user = await this.findUser(userData.googleId, userData.email);
		if (!user) {
			console.log("NO user found , creating new...");
			user = await this.createUser(userData);
		} else {
			console.log("User login success !!!!");
		}
		return user;
	}

	async findUserById(userId: string): Promise<IUser | null> {
		return this.userRepository.findByUserId(userId)
	}
}

export default UserService;
