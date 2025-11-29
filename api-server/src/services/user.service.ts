import { Profile } from "passport";
import { IUserRepository } from "../interfaces/repository/IUserRepository.js";
import { IUserSerivce } from "../interfaces/service/IUserService.js";
import { AuthProvidersList, IUser } from "../models/User.js";
import AppError from "../utils/AppError.js";
import { IProjectService } from "../interfaces/service/IProjectService.js";
import { PLANS } from "../constants/plan.js";

class UserService implements IUserSerivce {
	private userRepository: IUserRepository;
	private projectService: IProjectService
	constructor(userRepo: IUserRepository, projectServce: IProjectService) {
		this.userRepository = userRepo;
		this.projectService = projectServce
	}

	async findUser(googleId: string, email: string): Promise<IUser | null> {
		return await this.userRepository.findByEmailOrGoogleId(email, googleId);
	}
	async createUser(userData: Partial<IUser>): Promise<IUser> {
		return await this.userRepository.createUser(userData);
	}

	private async oauthLoginStrategy(
		profile: Profile,
		provider: AuthProvidersList
	): Promise<IUser> {
		console.log(`${provider} login`);

		const { emails } = profile;
		if (emails?.length === 0 || !emails) {
			throw new AppError("User email not found", 400);
		}

		let user = await this.userRepository.findByUserEmail(emails[0].value);

		if (!user) {
			const newUser: Partial<IUser> = {
				name: profile.displayName,
				email: emails[0].value,
				profileImage: profile.photos?.[0].value || "",
				authProviders: [{ provider, id: profile.id }],
			};
			user = await this.createUser(newUser);
			console.log("No user found, created new...");
			return user;
		}

		const hasProvider = user.authProviders.some(p => p.provider === provider);

		if (!hasProvider) {
			user = await this.userRepository.updateUser(user._id, {
				authProviders: [
					...user.authProviders,
					{ provider, id: profile.id }
				]
			});
		}

		return user as IUser;
	}

	async googleLoginStrategy(profile: Profile): Promise<IUser> {
		return this.oauthLoginStrategy(profile, AuthProvidersList.GOOGLE);
	}

	async githubLoginStrategy(profile: Profile): Promise<IUser> {
		return this.oauthLoginStrategy(profile, AuthProvidersList.GITHUB);
	}

	async getUser(userId: string): Promise<IUser | null> {
		return await this.userRepository.findByUserId(userId)
	}

	async getUserDetailed(userId: string): Promise<{ user: IUser | null; bandwidth: number; }> {
		const [user, bandwidth] = await Promise.all([
			this.userRepository.findByUserId(userId),
			this.projectService.getUserBandwidthData(userId, true)
		]);
		return { user, bandwidth };
	}

	async userCanDeploy(userId: string): Promise<{ user: IUser | null, limit: number, allowed: boolean, remaining: number }> {
		const user = await this.userRepository.getOrUpdateDeployments(userId)
		if (!user) throw new Error("User not found");

		const limit = PLANS[user.plan].maxDailyDeployments;
		const allowed = user.deploymentsToday < limit;
		const remaining = Math.max(0, limit - user.deploymentsToday);

		return { user, limit, allowed, remaining }
	}

	async incrementDeployment(userId: string): Promise<void> {
		await this.userRepository.incrementDeployment(userId);
	}
}

export default UserService;
