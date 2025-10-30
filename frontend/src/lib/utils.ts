
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
export const timeToSeconds = (time: number | undefined) => {
	if (!time) return time
	return (time / 1000).toFixed(2) + " s";
}


export const getElapsedTime = (oldTime: Date | string): string => {
	const diff = Date.now() - new Date(oldTime).getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d `;
	if (hours > 0) return `${hours}h ${minutes % 60}m `;
	if (minutes > 0) return `${minutes}m ${seconds % 60}s `;
	return `${seconds}s `;
};


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

export const getStatusBg = (status: string) => {
	switch (status) {
		case 'READY':
			return 'bg-emerald-500';
		case 'BUILDING':
			return 'bg-amber-500';
		case 'FAILED':
			return 'bg-red-500';
		case 'CANCELLED':
			return 'bg-red-500';
		default:
			return 'bg-gray-500';
	}
};
export const getStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case 'ready':
			return 'text-emerald-500 bg-emerald-500/10';
		case 'failed':
			return 'text-red-500 bg-red-500/10';
		case 'cancelled':
			return 'text-red-500 bg-red-500/10';
		case 'building':
			return 'text-amber-500 bg-amber-500/10';
		default:
			return 'text-gray-500 bg-gray-500/10';
	}
};
export const getLevelColor = (level: string) => {
	switch (level) {
		case 'ERROR': return 'text-red-400';
		case 'WARN': return 'text-yellow-500';
		case 'SUCCESS': return 'text-green-400';
		default: return 'text-gray-500';
	}
};


export const formatLogTime = (time: string | Date) => {
	const date = new Date(time)
	let hours = date.getHours()
	const minutes = date.getMinutes().toString().padStart(2, "0")
	const seconds = date.getSeconds().toString().padStart(2, "0")

	const ampm = hours >= 12 ? "PM" : "AM"
	hours = hours % 12 || 12

	return `${date.getMonth() + 1}/${date.getDate()} - ${hours}:${minutes}:${seconds} ${ampm}`
}