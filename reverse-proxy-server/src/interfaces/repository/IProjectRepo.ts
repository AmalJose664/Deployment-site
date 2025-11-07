import { IProject } from "../../models/Project.js";

export interface IProjectRepo {
	getProjectBySlug(slug: string): Promise<IProject | null>
}