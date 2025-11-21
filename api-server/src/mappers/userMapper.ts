import { IUser } from "../models/User.js";
interface UserResponseDTO {
	name: string
	profileImage: string
	email: string
	projects: number
	createdAt: Date
	_id: string
}
export class UserMapper {
	static toUserResponse(user: IUser): { user: UserResponseDTO } {
		return {
			user: {
				_id: user._id.toString(),
				name: user.name,
				email: user.email,
				profileImage: user.profileImage,
				projects: user.projects,
				createdAt: user.createdAt
			}
		}
	}
}