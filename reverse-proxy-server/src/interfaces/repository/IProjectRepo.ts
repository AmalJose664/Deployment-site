import { IProject } from "../../models/Project.js";

export interface IProjectRepo {
	getProjectById(id: string): Promise<IProject | null>
	getProjectByIdWithUser(id: string): Promise<IProject | null>
	getProjectBySlug(slug: string): Promise<IProject | null>
	getProjectBySlugWithUser(slug: string): Promise<IProject | null>
}