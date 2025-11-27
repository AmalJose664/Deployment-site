import { Types } from "mongoose";


export interface IProjectBandwidthRepository {
	getUserMonthlyBandwidth(userId: Types.ObjectId): Promise<number>
}