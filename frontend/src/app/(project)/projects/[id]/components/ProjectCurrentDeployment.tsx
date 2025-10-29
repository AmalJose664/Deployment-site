

import { IoMdGitBranch } from "react-icons/io";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { MdAccessTime } from "react-icons/md";
import { Deployment } from "@/types/Deployment";
import { getElapsedTime, getGithubBranchUrl, getGithubCommitUrl, getStatusColor, timeToSeconds } from "@/lib/utils";
import Link from "next/link";
import StatusIcon from "@/components/ui/StatusIcon";


interface ProjectDeploymentProps {
	deployment: Deployment;
	projectBranch: string;
	repoURL: string
}

const ProjectCurrentDeployment = ({ deployment, projectBranch, repoURL }: ProjectDeploymentProps) => {

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
							<div className="pt-1"><StatusIcon status={deployment.status} /></div>
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