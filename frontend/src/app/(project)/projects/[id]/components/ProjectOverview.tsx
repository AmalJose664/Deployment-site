
import { IoMdGlobe, IoMdGitBranch } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { FiGithub, FiGitCommit, FiMoreHorizontal } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";

import { User } from "@/types/User";
import { Project, ProjectStatus } from "@/types/Project";
import Link from "next/link";
import TechStack from "@/components/TechStack";
import { getGithubBranchUrl, getGithubCommitUrl, getStatusColor, timeToSeconds } from "@/lib/utils";
import StatusIcon from "@/components/ui/StatusIcon";


interface ProjectOverviewProps {
	project: Project,
	deploymentCommitHash?: string
	deploymentDuration: number | undefined
	errorMessage?: string
}

const ProjectOverview = ({ project, deploymentCommitHash, deploymentDuration, errorMessage }: ProjectOverviewProps) => {
	const repoValues = project.repoURL.split("/")
	const repoWithUser = repoValues[3] + "/" + repoValues[4]

	return (
		<>
			<div className="flex flex-col items-stretch  sm:flex-row  md:flex-row gap-2 sm:gap-4 lg:gap-6 p-2 sm:p-4 lg:p-6 w-full h-full">

				<div className='flex flex-col justify-between w-3/5 border  rounded-xl p-6 shadow-sm'>

					<div className='flex justify-between items-start mb-6'>
						<h3 className='text-2xl font-bold'>{project.name}</h3>

						<div className='flex items-center gap-3'>
							<span className="flex gap-2 text-sm">
								<img className="size-4 rounded-full" src={project ? ((project.user as User).profileImage) : ""} alt="User image" />
								{(project.user as User).name}
							</span>
							<span className='flex gap-2 items-center text-sm'>
								<CiCalendarDate /><span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
							</span>
							<Link href={project.repoURL} target="_blank">
								<button className='p-2 border flex gap-1 text-xs items-center dark:bg-gray-950 bg-gray-100  rounded-lg transition-colors'>
									<FiGithub className='size-3 text-primary' /> {repoWithUser}
								</button>
							</Link>
						</div>
					</div>
					<div className='flex flex-col gap-1 flex-1'>
						<div className='border-b mb-1'>
							<p className='text-sm mb-1'>Domain</p>
							<div className='flex items-center gap-2'>
								<div className='p-2  rounded-lg'>
									<IoMdGlobe className='size-4 text-less' />
								</div>
								<div>
									<Link href={'http://' + project.subdomain + '.localhost'} className='text-sm font-medium '>
										{project.subdomain}
									</Link>
								</div>
							</div>
						</div>

						<div className='border-b mb-1'>
							<p className='text-sm mb-1'>Source</p>
							<div className='flex items-center gap-2'>
								<div className='p-2 rounded-lg'>
									<IoMdGitBranch className='size-4 text-less' />
								</div>
								<div>
									<Link target="_blank" href={getGithubBranchUrl(project.repoURL, project.branch)} className='text-sm hover:underline font-medium '>{project.branch}</Link>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='p-2 rounded-lg'>
									<FiGitCommit className='size-4 text-less' />
								</div>
								<div>
									<Link target="_blank" href={getGithubCommitUrl(project.repoURL, deploymentCommitHash || "")} className='text-sm font-medium hover:underline'>{deploymentCommitHash || ""}</Link>
								</div>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<div className='p-2  rounded-lg'>
								<StatusIcon status={project.status} />
							</div>
							<div className='flex gap-2 items-center'>
								<p className='text-xs text-less font-medium'>Status</p>
								<p className={`text-sm font-bold rounded-xs px-1 ${getStatusColor(project.status)}`}>{project.status}</p>
							</div>
						</div>
						{project.status === ProjectStatus.CANCELED && (
							<div className='flex items-center gap-2'>
								<div className='p-2  rounded-lg'>
									<StatusIcon status={project.status} />
								</div>
								<div className='flex gap-2 items-center'>
									<p className='text-xs text-less font-medium'>Reason</p>
									<p className={`text-sm font-bold rounded-xs px-1 ${getStatusColor(project.status)}`}>{errorMessage}</p>
								</div>
							</div>
						)}
						<div className='flex items-center gap-2'>
							<div className='p-2 rounded-lg'>
								<MdAccessTime className='size-4 text-less' />
							</div>
							<div>
								<p className='text-sm font-medium '>
									<span className="text-less">
										Duration{" "}</span>
									{timeToSeconds(deploymentDuration) || "- - - -"}
								</p>
							</div>
						</div>
					</div>

					<div className='flex gap-2 mt-2 pt-4 border-t '>
						<button className='px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'>
							View Logs
						</button>
						<button className='px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors'>
							Settings
						</button>
					</div>
				</div>
				<TechStack stack={project.techStack.toLowerCase()} />
			</div>

		</>
	)
}
export default ProjectOverview
