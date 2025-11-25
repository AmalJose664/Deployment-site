import { IUser } from "../models/User.js";
interface UserResponseDTO {
	name: string
	profileImage: string
	_id: string
}
interface UserResponseDetailedDTO {
	name: string
	profileImage: string
	email: string
	projects: number
	bandwidthMonthly: number
	deploymentsToday: number
	plan: string
	createdAt: Date
	_id: string
}
export class UserMapper {
	static toUserResponse(user: IUser): { user: UserResponseDTO } {
		return {
			user: {
				_id: user._id.toString(),
				name: user.name,
				profileImage: user.profileImage,
			}
		}
	}
	static toUserDetailedResponse(data: { user: IUser, bandwidth: number; }): { user: UserResponseDetailedDTO } {
		const { user } = data
		return {
			user: {
				_id: user._id.toString(),
				name: user.name,
				profileImage: user.profileImage,
				email: user.email,
				projects: Number(user.projects),
				deploymentsToday: Number(user.deploymentsToday),
				plan: user.plan,
				createdAt: user.createdAt,
				bandwidthMonthly: data.bandwidth
			}
		}
	}
}