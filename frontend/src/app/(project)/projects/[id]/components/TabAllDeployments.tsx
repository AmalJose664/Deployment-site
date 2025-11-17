import StatusIcon from "@/components/ui/StatusIcon"
import { getElapsedTime, getGithubBranchUrl, getGithubCommitUrl, getStatusColor, timeToSeconds } from "@/lib/utils"
import { useGetProjectDeploymentsQuery } from "@/store/services/deploymentApi"
import Link from "next/link"
import { IoMdGitBranch } from "react-icons/io"
import { LiaExternalLinkAltSolid } from "react-icons/lia"
import { MdAccessTime } from "react-icons/md"
import NoDeployment from "./NoDeployment"
import { ProjectStatus } from "@/types/Project"

interface AllDeploymentProps {
	projectId: string;
	repoURL: string;
	projectBranch: string
	setTab: () => void
}
const AllDeployments = ({ projectId, repoURL, projectBranch, setTab }: AllDeploymentProps) => {

	const { data: deployments, isLoading, isError, error } = useGetProjectDeploymentsQuery(projectId)
	console.log("re render")
	return (
		<div>
			{isLoading && (
				<div className="flex items-center justify-center text-primary">
					Loading...
				</div>
			)}
			{deployments?.length && deployments.map((deployment) => {
				return (
					<div key={deployment._id} className="divide-y divide-gray-800 border mb-1 dark:border-neutral-800 border-neutral-300 rounded-md">
						<div
							className="px-6 py-4 dark:hover:bg-zinc-800/50 hover:bg-neutral-300 transition-colors cursor-pointer"
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
										<div className="flex gap-2">
											<Link href={getGithubCommitUrl(repoURL, deployment.commitHash)} target="_blank" className="hover:underline text-sm text-primary mb-1">{deployment.commitHash}</Link>
											{(deployment.errorMessage && deployment.status === ProjectStatus.CANCELED) &&
												<p className="text-red-400 text-sm">Cancel reason: {" " + deployment.errorMessage}</p>}
										</div>

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
				)
			})}
			{((deployments?.length === 0 || !deployments) && !isLoading) && (
				<div>

					<NoDeployment onCreateDeployment={setTab} />
				</div>
			)}
			{(isError && (error as any).status !== 404) && (
				<div className="flex   items-center justify-center">
					<div className="border  p-4 rounded-md">
						<p>Error Loading Deployments</p>
						<p>{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message || "Something went wrong"}</p>
					</div>
				</div>
			)}
		</div>
	)
}
export default AllDeployments