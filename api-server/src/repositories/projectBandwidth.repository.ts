import { IProjectBandwidthRepository } from "../interfaces/repository/IProjectBandwidthRepository.js";
import { BandWidthWithProjectType } from "../interfaces/service/IAnalyticsService.js";
import { IProjectBandwiths, ProjectBandwidth } from "../models/ProjectBandwidths.js";
import { IProject } from "../models/Projects.js";
import { BaseRepository } from "./base/base.repository.js";

class ProjectBandwidthRepository extends BaseRepository<IProjectBandwiths> implements IProjectBandwidthRepository {
	constructor() {
		super(ProjectBandwidth);
	}

	async addProjectField(project: IProject): Promise<void> {
		this.create({ project: project._id as any, user: project.user })
	}
	async addBandwidth(projectWithSize: BandWidthWithProjectType): Promise<void> {
		const currentMonth = new Date().toISOString().slice(0, 7);
		const bulkUpdates = Object.entries(projectWithSize).map(([projectId, bandwidth]) => ({
			updateOne: {
				filter: { project: projectId },
				update: [
					{
						$set: {
							bandwidthMonthly: {
								$cond: {
									if: { $ne: ["$currentMonth", currentMonth] },
									then: bandwidth,
									else: { $add: ["$bandwidthMonthly", bandwidth] }
								}
							},
							currentMonth: currentMonth,
							bandwidthTotal: { $add: ["$bandwidthTotal", bandwidth] }
						}
					}
				],
				upsert: true
			}
		}))
		await ProjectBandwidth.bulkWrite(bulkUpdates)
	}
	async getUserMonthlyBandwidth(userId: string): Promise<number> {
		const currentMonth = new Date().toISOString().slice(0, 7);

		return 9
	}

	async getProjectMonthlyBandwidth(projectId: string): Promise<number> {
		return 9
	}

	async getUserProjectsBandwidth(userId: string): Promise<Array<{ projectId: string, bandwidth: number }>> {
		const currentMonth = new Date().toISOString().slice(0, 7);
		return [{ bandwidth: 9, projectId: "" }]
	}
}
export default ProjectBandwidthRepository