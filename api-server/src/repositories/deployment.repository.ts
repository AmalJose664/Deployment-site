import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { Deployment, DeploymentStatus, IDeployment } from "../models/Deployment.js";
import { BaseRepository } from "./base/base.repository.js";

class DeploymentRepository extends BaseRepository<IDeployment> implements IDeploymentRepository {
    constructor() {
        super(Deployment);
    }
    async createD(deploymentData: Partial<IDeployment>): Promise<IDeployment | null> {
        const deployment = new Deployment(deploymentData);
        const savedDeployment = await deployment.save();
        return savedDeployment;
    }

    async findAllD(userId: string): Promise<IDeployment[]> {
        return await Deployment.find({ userId: userId }).exec();
    }
    async findProjectD(userId: string, projectId: string): Promise<IDeployment[]> {
        return await Deployment.find({ userId, project: projectId });
    }

    async updateD(projectId: string, deploymentId: string, userId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null> {
        const result = await Deployment.findOneAndUpdate({ project: projectId, userId, _id: deploymentId }, { $set: updateData }, { new: true });
        return result;
    }

    async updateStatusD(projectId: string, deploymentId: string, userId: string, status: DeploymentStatus): Promise<IDeployment | null> {
        return await this.updateD(projectId, deploymentId, userId, { status });
    }
    async findD(id: string): Promise<IDeployment | null> {
        return Deployment.findById(id);
    }
    async deleteD(projectId: string, deploymentId: string, userId: string): Promise<number> {
        const result = await Deployment.deleteOne({ project: projectId, _id: deploymentId, userId });
        return result.deletedCount;
    }
}
export default DeploymentRepository;
