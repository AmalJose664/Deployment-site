export interface User {
	name: string
	profileImage: string
	_id: string
}
export interface UserDetailed {
	name: string
	profileImage: string
	email: string
	projects: number
	bandwidthMonthly: number
	createdAt: Date
	_id: string
}
