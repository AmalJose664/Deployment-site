import { FilterQuery } from "mongoose";
import { QueryDeploymentDTO } from "../dtos/deployment.dto.js";
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

    async findDeploymentById(id: string, userId: string, includesField?: string): Promise<IDeployment | null> {
        let dbQuery: FilterQuery<IDeployment> = { user: userId, _id: id };
        let deploymentQuery = this.findOne(dbQuery);
        if (includesField?.includes("project")) {
            deploymentQuery = deploymentQuery.populate("project", "name branch subdomain repoURL");
        }
        if (includesField?.includes("user")) {
            deploymentQuery = deploymentQuery.populate("user", "name email profileImage");
        }
        return await deploymentQuery.exec();
    }
    async findAllDeployments(userId: string, query: QueryDeploymentDTO): Promise<{ deployments: IDeployment[]; total: number }> {
        let dbQuery: FilterQuery<IDeployment> = { user: userId };
        if (query.search) {
            dbQuery = { ...dbQuery, commit_hash: { $regex: query.search, $options: "i" } };
        }
        if (query.status) {
            dbQuery.status = { $eq: query.status };
        }
        let deploymentsQuery = Deployment.find(dbQuery, { file_structure: 0 })
            .limit(query.limit)
            .skip((query.page - 1) * query.limit);

        if (query.include?.includes("project")) {
            deploymentsQuery = deploymentsQuery.populate("project", "name branch subdomain repoURL");
        }
        if (query.include?.includes("user")) {
            deploymentsQuery = deploymentsQuery.populate("user", "name email profileImage");
        }
        const deployments = await deploymentsQuery.sort("-_id").exec();

        const total = await this.count(dbQuery);
        return { deployments, total };
    }

    async findProjectDeployments(
        userId: string,
        projectId: string,
        query: QueryDeploymentDTO,
    ): Promise<{ deployments: IDeployment[]; total: number }> {
        let dbQuery: FilterQuery<IDeployment> = { user: userId, project: projectId };
        if (query.search) {
            dbQuery = { ...dbQuery, commit_hash: { $regex: query.search, $options: "i" } };
        }
        if (query.status) {
            dbQuery.status = { $eq: query.status };
        }
        let deploymentsQuery = Deployment.find(dbQuery, { file_structure: 0 })
            .limit(query.limit)
            .skip((query.page - 1) * query.limit);
        if (query.include?.includes("project")) {
            deploymentsQuery = deploymentsQuery.populate("project", "name branch subdomain");
        }
        if (query.include?.includes("user")) {
            deploymentsQuery = deploymentsQuery.populate("user", "name email profileImage");
        }
        const deployments = await deploymentsQuery.sort("-_id").exec();
        const total = await this.count(dbQuery);
        return { deployments, total };
    }

    async deleteDeployment(projectId: string, deploymentId: string, userId: string): Promise<number> {
        const result = await Deployment.deleteOne({ project: projectId, _id: deploymentId, user: userId });
        return result.deletedCount;
    }
    async __updateDeployment(projectId: string, deploymentId: string, updateData: Partial<IDeployment>): Promise<IDeployment | null> {
        return await Deployment.findOneAndUpdate({ project: projectId, _id: deploymentId }, { $set: updateData }, { new: true });
    }
    async __findDeployment(id: string): Promise<IDeployment | null> {
        return await Deployment.findById(id);
    }
    async __findAllProjectDeployment(projectId: string, sortOptions?: string | Record<string, 1 | -1>): Promise<IDeployment[]> {
        return await Deployment.find({ project: projectId }).sort(sortOptions || {});
    }
}
export default DeploymentRepository;
