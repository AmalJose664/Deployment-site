import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
export const timeToSeconds = (time: number | undefined) => {
	if (!time) return time
	return (time / 1000).toFixed(2) + " s";
}
export const getElapsedTime = (oldTime: Date) => {
	const diff = Date.now() - new Date(oldTime).getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) return `${hours}h ${minutes % 60}m`;
	if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
	return `${seconds}s`;
}
export const getGithubBranchUrl = (repoUrl: string, branch: string) => {
	if (repoUrl.includes(".git")) {
		repoUrl = repoUrl.replace(/\.git$/, "");
	}
	return `${repoUrl.replace(/\/$/, '')}/tree/${branch}`;
}

export const getGithubCommitUrl = (repoUrl: string, commitId: string) => {
	if (repoUrl.endsWith(".git")) {
		repoUrl = repoUrl.replace(/\.git$/, "");
	}
	repoUrl = repoUrl.replace(/\/$/, "");

	return `${repoUrl}/commit/${commitId}`;
};