import { redisService } from "../cache/redis.js";
import { IRedisCache } from "../interfaces/cache/IRedis.js";
import { IDeploymentRepository } from "../interfaces/repository/IDeploymentRepository.js";
import { DeploymentResult, IDeploymentService } from "../interfaces/service/IDeploymentService.js";
import { deploymentRepo } from "../repository/deployment.repo.js";

// ←
class DeploymentService implements IDeploymentService {
	private deploymentRepo: IDeploymentRepository;

	private redisCache: IRedisCache
	constructor(deploymentRepo: IDeploymentRepository, redisCache: IRedisCache) {
		this.deploymentRepo = deploymentRepo;
		this.redisCache = redisCache
	}

	async findDeploymentByPublicId(publicId: string): Promise<DeploymentResult | null> {
		const cacheKey = `dep-${publicId}`
		const dataFromCache = await this.redisCache.get<DeploymentResult>(cacheKey) || null

		if (dataFromCache) {
			return dataFromCache as DeploymentResult
		}
		const deployment = await this.deploymentRepo.getDeploymentByPublicId(publicId)
		if (!deployment) {
			return null
		}

		const deploymentRefined = {
			_id: deployment._id.toString(),
			projectId: deployment.project.toString(),
		}
		this.redisCache.set(cacheKey, deploymentRefined)
		return deploymentRefined
	}
	invalidateSlug(publicId: string): boolean {
		const cacheKey = `dep-${publicId}`
		return Boolean(this.redisCache.del(cacheKey))
	}
}


export const deploymentService = new DeploymentService(deploymentRepo, redisService)