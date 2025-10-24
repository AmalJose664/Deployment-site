import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { Deployment, DeploymentStatus, IDeployment } from "../models/Deployment.js";
import { BaseRepository } from "./base/base.repository.js";

class DeploymentRepository extends BaseRepository<IDeployment> implements IDeploymentRepository {
	constructor() {
		super(Deployment);
	}
	async createDeployment(deploymentData: Partial<IDeployment>): Promise<IDeployment | null> {
		const deployment = new Deployment(deploymentData);
		const savedDeployment = await deployment.save();
		return savedDeployment;
	}

	async findAllDeployments(userId: string, query: {
		page: number,
		limit: number,
		status?: DeploymentStatus,
		search?: string,
	}): Promise<IDeployment[]> {
		let dbQuery: any = { user: userId };
		if (query.search) {
			dbQuery = { ...dbQuery, commit_hash: { $regex: query.search, $options: "i" } }
		}
		if (query.status) {
			dbQuery.status = { $eq: query.status };
		}

		const deployments = await this.findMany(dbQuery)
			.limit(query.limit)
			.skip((query.page - 1) * query.limit)
			.exec();
		return deployments
	}
	async findDeploymentById(id: string, userId: string): Promise<IDeployment | null> {
		return await Deployment.findOne({ _id: id, userId })
	}
	async findProjectDeployments(userId: string, projectId: string): Promise<IDeployment[]> { // QUERY FIX
		return await Deployment.find({ userId, project: projectId });
	}


	async deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number> {
		const result = await Deployment.deleteOne({ project: projectId, _id: deploymentId, userId });
		return result.deletedCount;
	}
	async __updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null> {
		return await Deployment.findOneAndUpdate({ project: projectId, _id: deploymentId }, { $set: updateData }, { new: true });

	}
	async __findDeployment(id: string): Promise<IDeployment | null> {
		return await Deployment.findById(id);
	}
}
export default DeploymentRepository;
