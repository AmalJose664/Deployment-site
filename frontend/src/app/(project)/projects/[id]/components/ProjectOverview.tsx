
import { IoMdGlobe, IoMdGitBranch } from "react-icons/io";
import { GiCheckMark } from "react-icons/gi";
import { FiGithub, FiGitCommit, FiMoreHorizontal } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";

import { User } from "@/types/User";
import { Project } from "@/types/Project";
import Link from "next/link";
import TechStack from "@/components/TechStack";

interface ProjectOverviewProps {
	project: Project,
	deploymentCommitHash?: string
	deploymentDuration: number | undefined
}

const ProjectOverview = ({ project, deploymentCommitHash, deploymentDuration }: ProjectOverviewProps) => {
	return (
		<>
			<div className='flex items-stretch gap-4 h-full w-full p-4'>

				<div className='flex flex-col justify-between w-3/5 border  rounded-xl p-6 shadow-sm'>

					<div className='flex justify-between items-start mb-6'>
						<h3 className='text-2xl font-bold'>{project.name}</h3>

						<div className='flex items-center gap-3'>
							<span className="flex gap-2">
								<img className="size-5 rounded-full" src={project ? ((project.user as User).profileImage) : ""} alt="User image" />
								{(project.user as User).name}
							</span>
							<span className='flex gap-2 items-center'>
								<CiCalendarDate /><span>Setp-06</span>
							</span>
							<Link href={project.repoURL} target="_blank">
								<button className='p-2 border dark:bg-gray-950 bg-gray-100  rounded-lg transition-colors'>
									<FiGithub className='size-5 text-primary' />
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
									<Link href={'https://' + project.subdomain + '.com'} className='text-sm font-medium '>
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
									<p className='text-sm font-medium '>{project.branch}</p>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='p-2 rounded-lg'>
									<FiGitCommit className='size-4 text-less' />
								</div>
								<div>
									<p className='text-sm font-medium '>{deploymentCommitHash || ""}</p>
								</div>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<div className='p-2  rounded-lg'>
								<GiCheckMark className='size-3 text-emerald-400' />
							</div>
							<div className='flex gap-2'>
								<p className='text-xs text-less font-medium'>Status</p>
								<p className='text-sm font-bold text-emerald-400'>{project.status}</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<div className='p-2 rounded-lg'>
								<MdAccessTime className='size-4 text-less' />
							</div>
							<div>
								<p className='text-sm font-medium '>{deploymentDuration || "- - - -"}</p>
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
				<TechStack stack='react' />
			</div>

		</>
	)
}
export default ProjectOverview
