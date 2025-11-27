import { Model, Types } from "mongoose";
import { IProjectBandwidthRepository } from "../interfaces/repository/IProjectBandwidth.js";
import { IProjectBandwiths, ProjectBandwidth } from "../models/ProjectBandwidth.js";



class ProjectBandwidthRepository implements IProjectBandwidthRepository {
	private model: Model<IProjectBandwiths>
	constructor(projectModel: Model<IProjectBandwiths>) {
		this.model = projectModel
	}


	private async sumMonthlyBandwidth(filter: Record<string, any>): Promise<number> {
		const currentMonth = new Date().toISOString().slice(0, 7);

		const result = await ProjectBandwidth.aggregate([
			{ $match: { ...filter, currentMonth } },
			{ $group: { _id: null, total: { $sum: "$bandwidthMonthly" } } }
		]);

		return result[0]?.total ?? 0;
	}

	async getUserMonthlyBandwidth(userId: Types.ObjectId): Promise<number> {
		return this.sumMonthlyBandwidth({ user: userId });
	}




}
export const projectBandwidthRepo = new ProjectBandwidthRepository(ProjectBandwidth)