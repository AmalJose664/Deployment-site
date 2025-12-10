
import { IoMdGlobe, IoMdGitBranch } from "react-icons/io";
import { BsActivity } from "react-icons/bs";
import { VscLibrary } from "react-icons/vsc";
import { FiGithub, FiGitCommit, } from "react-icons/fi";
import { GrRotateRight } from "react-icons/gr";
import { CgUnavailable } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { MdAccessTime, MdCreate } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";
import { User } from "@/types/User";
import { Project, ProjectStatus } from "@/types/Project";
import Link from "next/link";
import TechStack from "@/components/project/TechStack";
import { getGithubBranchUrl, getGithubCommitUrl, getStatusColor, parseGitHubRepo, timeToSeconds } from "@/lib/utils";
import StatusIcon, { AnimationBuild } from "@/components/ui/StatusIcon";
import { toast } from "sonner"
import { Deployment } from "@/types/Deployment";
import { Button } from "@/components/ui/button";
import RightFadeComponent from "@/components/RightFadeComponent";

interface ProjectOverviewProps {
	project: Project,
	deployment?: Deployment
	reDeploy: () => void
	setShowBuild: (state: boolean) => void;
	setTabs: (state: string) => void;
}
const ProjectOverview = ({ project, deployment, reDeploy, setShowBuild, setTabs }: ProjectOverviewProps) => {
	const isprojectError = project.status === ProjectStatus.CANCELED || project.status === ProjectStatus.FAILED
	const isDeplymentError = project.deployments?.length !== 0
		&& deployment
		&& (deployment.status === ProjectStatus.CANCELED
			|| deployment?.status === ProjectStatus.FAILED)
	const repoValues = parseGitHubRepo(project.repoURL)
	const projectLink = `${window.location.protocol}//${project.subdomain}.${process.env.NEXT_PUBLIC_PROXY_SERVER}`
	return (
		<>
			<div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<RightFadeComponent className="border   rounded-lg dark:bg-neutral-900  bg-white overflow-hidden">
							<div className="px-4 py-3 border-b   flex justify-between items-start">
								<div>
									<h3 className="text-lg font-medium  text-primary">Production Deployment</h3>
								</div>
								<div className="flex items-center gap-2">
									<Link href={projectLink} target="_blank" className="p-2 hover:bg-secondary rounded-md text-primary"><RxExternalLink size={16} /></Link>
								</div>
							</div>
							<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
								<TechStack link={projectLink} stack={project.techStack.toLowerCase()} />
								<div className="space-y-4">
									<div>
										<span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</span>
										<div className="mt-1  flex items-center gap-2">
											<StatusIcon status={project.status} />
											<p className={`text-sm font-bold rounded-xs px-1 ${getStatusColor(project.status)}`}>{project.status}</p>
											{(project.status === ProjectStatus.BUILDING || project.status === ProjectStatus.QUEUED) &&
												<AnimationBuild />
											}
										</div>
									</div>
									{isprojectError && (
										<div>
											<span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Reason</span>
											<div className="flex items-center gap-2">
												<StatusIcon status={project.status} />
												<p className="text-sm font-bold rounded-xs px-1 text-red-400 w-fit bg-red-800/30">{deployment?.errorMessage || " hey message"}</p>
											</div>
										</div>
									)}
									<div>
										<span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Domains</span>
										<div className="mt-1 flex items-center gap-2">
											<IoMdGlobe className='size-4 text-less' />
											<Link target="_blank"
												href={
													project.status === ProjectStatus.READY
														? projectLink
														: ""
												}
												className='flex gap-2 items-center text-sm font-medium '>
												{`${window.location.protocol}//${project.subdomain}`}
												<RxExternalLink />
											</Link>
											<div>
												{project.status !== ProjectStatus.READY && <CgUnavailable className="text-red-400" />}
											</div>
										</div>
									</div>

									<div>
										<span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Source</span>
										<div className="mt-1 flex items-start gap-2">
											<FiGitCommit size={16} className="text-gray-500 mt-0.5" />
											<div>
												<p className="text-xs  text-primary font-mono">{deployment?.commit.id.slice(0, 10) || "" + "..."}</p>
												<p className="text-sm text-gray-400 line-clamp-1">{deployment?.commit.msg}</p>
											</div>
										</div>
									</div>

									<div className="pt-2">
										<p className="text-xs text-gray-500">Deployed by <span className=" text-less">{(project.user as User).name}</span></p>
									</div>
								</div>
							</div>
						</RightFadeComponent>
						<RightFadeComponent delay={.07} className="border   rounded-lg dark:bg-neutral-900  bg-white px-3 py-2">
							<h4 className="text-sm font-medium  text-primary mb-4">Options</h4>
							<div className="rounded-lg dark:bg-neutral-900  bg-white px-4 py-2 flex items-center gap-3">
								{(isprojectError)
									&&
									(isDeplymentError) &&
									<Button variant={"secondary"} onClick={reDeploy} className='hover:!bg-primary hover:!text-secondary !duration-200
								 border rounded-lg text-sm font-medium  transition-colors  flex justify-start gap-3 px-4 py-3'>
										Re Deploy < GrRotateRight className="text-green-400 group-hover:rotate-z-90 transition-all duration-300" />
									</Button>
								}
								<Button variant={"secondary"} onClick={() => setTabs("settings")}
									className='hover:!bg-primary hover:!text-secondary !duration-200 group
								 border rounded-lg text-sm font-medium  transition-colors  flex justify-start gap-3 px-4 py-3'>
									Settings <IoSettingsOutline className="group-hover:!translate-x-1.5 group-hover:!rotate-z-45 !transition-all !duration-300" />
								</Button>
								<Button variant={"secondary"} onClick={() => setTabs("monitoring")}
									className='hover:!bg-primary hover:!text-secondary !duration-200
								 border rounded-lg text-sm font-medium  transition-colors  flex justify-start gap-3 px-4 py-3'>
									Usage & Analytics <BsActivity size={16} className="text-gray-500" />
								</Button>
							</div>
						</RightFadeComponent>
					</div>

					<div className="space-y-6">
						<RightFadeComponent delay={.14} className="border   rounded-lg dark:bg-neutral-900  bg-white p-5">
							<h4 className="text-sm font-medium  text-primary mb-4">Repository</h4>
							<div className="space-y-4">
								<div className="flex justify-between items-center py-2 border-b  /50 last:border-0">
									<div className="flex items-center gap-2">
										<FiGithub size={14} />
										<span className="text-xs text-gray-500">Git Repo</span>
									</div>
									<div className="flex items-center gap-2">
										<Link href={project.repoURL} target="_blank">
											<Button variant={"outline"} className='p-2 border flex gap-1 text-xs items-center rounded-lg group'>
												<FiGithub className='size-3 text-primary group-hover:rotate-y-180 transition-all duration-300' /> {repoValues[0] + "/" + repoValues[1]}
											</Button>
										</Link>
									</div>
								</div>
								<div className="flex justify-between items-center py-2 border-b  /50 last:border-0">
									<div className="flex items-center gap-2">
										<FiGitCommit size={14} />
										<span className="text-xs text-gray-500">Commit</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs  text-less">
											<Link target="_blank" href={getGithubCommitUrl(project.repoURL, deployment?.commit.id || "")} className='flex gap-2 items-center font-medium hover:underline'>
												{deployment?.commit.id.slice(0, 10) || "" + "..."}
												<p className="text-xl">/</p>
												{deployment?.commit.msg}
											</Link>
										</span>
									</div>
								</div>
								<div className="flex justify-between items-center py-2 border-b  /50 last:border-0">
									<div className="flex items-center gap-2">
										<IoMdGitBranch size={14} />
										<span className="text-xs text-gray-500">Branch</span>
									</div>
									<span className="text-sm  text-less"><Link target="_blank" href={getGithubBranchUrl(project.repoURL, project.branch)} className='text-sm hover:underline font-medium '>{project.branch}</Link>
									</span>
								</div>
							</div>
						</RightFadeComponent >
						<RightFadeComponent delay={.21} className="border   rounded-lg dark:bg-neutral-900  bg-white p-5">
							<h4 className="text-sm font-medium  text-primary mb-4">Project Details</h4>
							<div className="space-y-4">
								<div className="flex justify-between items-center py-2 border-b  /50 last:border-0">
									<div className="flex items-center gap-2">
										<VscLibrary size={14} />
										<span className="text-xs text-gray-500">Framework</span>
									</div>
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 bg-background border uppercase rounded-full text-primary flex items-center justify-center text-[10px] font-bold">
											{project.techStack.slice(0, 1)}
										</div>
										<span className="text-sm  text-less">{project.techStack}</span>
									</div>
								</div>
								<div className="flex justify-between items-center py-2 border-b  /50 last:border-0">
									<div className="flex items-center gap-2">
										<MdCreate size={14} />
										<span className="text-xs text-gray-500">Created</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm  text-less">{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
									</div>
								</div>
								<div className="flex justify-between items-center py-2 border-b  /50 last:border-0">
									<div className="flex items-center gap-2">
										<MdAccessTime size={14} />
										<span className="text-xs text-gray-500">Duration</span>
									</div>
									<span className="text-sm  text-less">{timeToSeconds(deployment?.performance.totalDuration) || "- - - -"}</span>
								</div>
							</div>
						</RightFadeComponent>
					</div>
				</div>
			</div>

		</>
	)
}
export default ProjectOverview
