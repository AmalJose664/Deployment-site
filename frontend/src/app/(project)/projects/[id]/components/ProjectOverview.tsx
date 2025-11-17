
import { IoMdGlobe, IoMdGitBranch } from "react-icons/io";

import { FiGithub, FiGitCommit, } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { GrRotateRight } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";
import { MdOutlineLineStyle } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";
import { User } from "@/types/User";
import { Project, ProjectStatus } from "@/types/Project";
import Link from "next/link";
import TechStack from "@/components/project/TechStack";
import { getGithubBranchUrl, getGithubCommitUrl, getStatusColor, timeToSeconds } from "@/lib/utils";
import StatusIcon, { AnimationBuild } from "@/components/ui/StatusIcon";
import { toast } from "sonner"
import { Deployment } from "@/types/Deployment";
import { Button } from "@/components/ui/button";

interface ProjectOverviewProps {
	project: Project,
	deployment?: Deployment
	reDeploy: () => void
	setShowBuild: (state: boolean) => void;
	goToSettings: () => void
}

const ProjectOverview = ({ project, deployment, reDeploy, setShowBuild, goToSettings }: ProjectOverviewProps) => {
	const repoValues = project.repoURL.split("/")
	const repoWithUser = repoValues[3] + "/" + repoValues[4]

	const triggerReDeploy = () => {
		toast.info("New Deployment started")
		reDeploy()
		// post deploy events sse
	}

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
								<Button variant={"outline"} className='p-2 border flex gap-1 text-xs items-center rounded-lg group'>
									<FiGithub className='size-3 text-primary group-hover:rotate-y-180 transition-all duration-300' /> {repoWithUser}
								</Button>
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
									<Link href={'http://' + project.subdomain + '.localhost'} className='flex gap-2 items-center text-sm font-medium '>
										{"http://" + project.subdomain}
										<RxExternalLink />
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
									<Link target="_blank" href={getGithubCommitUrl(project.repoURL, deployment?.commitHash || "")} className='text-sm font-medium hover:underline'>{deployment?.commitHash || ""}</Link>
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
								{(project.status === ProjectStatus.BUILDING || project.status === ProjectStatus.QUEUED) &&
									<AnimationBuild />
								}
							</div>
						</div>
						{project.status === ProjectStatus.CANCELED && (
							<div className='flex items-center gap-2'>
								<div className='p-2  rounded-lg'>
									<StatusIcon status={project.status} />
								</div>
								<div className='flex gap-2 items-center'>
									<p className='text-xs text-less font-medium'>Reason</p>
									<p className={`text-sm font-bold rounded-xs px-1 ${getStatusColor(project.status)}`}>{deployment?.errorMessage}</p>
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
									{timeToSeconds(deployment?.performance.totalDuration) || "- - - -"}
								</p>
							</div>
						</div>
					</div>

					<div className='flex gap-2 mt-2 pt-4 border-t '>
						<Button variant={"secondary"} onClick={() => setShowBuild(true)} className='border px-4 py-2 rounded-lg text-sm font-medium  transition-colors'>
							View Logs <MdOutlineLineStyle />
						</Button>
						{(project.status === ProjectStatus.CANCELED || project.status === ProjectStatus.FAILED)
							&&
							(deployment && (deployment?.status === ProjectStatus.CANCELED || deployment?.status === ProjectStatus.FAILED)) &&
							<Button variant={"secondary"} onClick={triggerReDeploy} className='border  group px-4 py-2 rounded-lg text-sm font-medium  transition-colors'>
								Re Deploy < GrRotateRight className="text-green-400 group-hover:rotate-z-90 transition-all duration-300" />
							</Button>
						}
						<Button variant={"secondary"} onClick={goToSettings} className='border group px-4 py-2  rounded-lg text-sm font-medium  transition-colors'>
							Settings <IoSettingsOutline className="group-hover:translate-x-1.5 group-hover:rotate-z-45 transition-all duration-300" />
						</Button>

					</div>
				</div>
				<TechStack stack={project.techStack.toLowerCase()} />
			</div>

		</>
	)
}
export default ProjectOverview
