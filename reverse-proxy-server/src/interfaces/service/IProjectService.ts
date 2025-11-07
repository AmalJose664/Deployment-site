import { IProject } from "../../models/Project.js";

export interface IProjectService {
	findProjectBySlug(slug: string): Promise<IProject | null>
}