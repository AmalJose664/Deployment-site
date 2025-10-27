import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
import { IoAlertCircleSharp } from "react-icons/io5";


import { IoMdGitBranch } from "react-icons/io";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { MdAccessTime } from "react-icons/md";
import { Deployment } from "@/types/Deployment";
import { getElapsedTime, getGithubBranchUrl, getGithubCommitUrl, timeToSeconds } from "@/lib/utils";
import Link from "next/link";




interface ProjectDeploymentProps {
	deployment: Deployment;
	projectBranch: string;
	repoURL: string
}



const ProjectCurrentDeployment = ({ deployment, projectBranch, repoURL }: ProjectDeploymentProps) => {
	const getStatusIcon = (status: string) => {

		switch (status.toLowerCase()) {
			case 'ready':
				return <GoCheckCircleFill className="text-emerald-500" size={18} />;
			case 'failed':
				return <GoXCircleFill className="text-red-500" size={18} />;
			case 'building':
				return <IoAlertCircleSharp className="text-amber-500" size={18} />;
			default:
				return null;
		}
	};

	const getStatusColor = (status: string) => {
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
	return (
		<div className="border  rounded-xl overflow-hidden">
			<div className="px-6 py-4 border-b border-gray-800">
				<h2 className="text-lg font-semibold">Current Deployment</h2>
			</div>


			<div className="divide-y divide-gray-800">
				<div
					className="px-6 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
				>
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-4 flex-1">
							<div className="pt-1">{getStatusIcon(deployment.status)}</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-3 mb-2">
									<span
										className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(
											deployment.status
										)}`}
									>
										{deployment.status}
									</span>
									<span className="text-xs  font-mono">
										{deployment.commitHash}
									</span>
									<span className="text-xs text-gray-500">{getElapsedTime(deployment.completedAt)} ago</span>
								</div>
								<Link href={getGithubCommitUrl(repoURL, deployment.commitHash)} target="_blank" className="hover:underline text-sm text-primary mb-1">{deployment.commitHash}</Link>
								<div className="flex items-center gap-4 text-xs text-gray-400">
									<div className="flex items-center text-xs gap-1.5">
										<IoMdGitBranch size={12} />
										<Link target="_blank" href={getGithubBranchUrl(repoURL, projectBranch)} className="hover:undeline">{projectBranch}</Link>
									</div>
									<div className="flex items-center text-xs gap-1.5">
										<MdAccessTime size={12} />
										<span>{timeToSeconds(deployment.performance.totalDuration)}</span>
									</div>
								</div>
							</div>
						</div>
						<button className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1">
							View Logs
							<LiaExternalLinkAltSolid size={12} />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
export default ProjectCurrentDeployment