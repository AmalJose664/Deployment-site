import { AnimatePresence, motion } from "motion/react"
import { MdKeyboardArrowRight } from "react-icons/md"
import ProjectOverview from "./ProjectOverview"
import ProjectCurrentDeployment from "./ProjectCurrentDeployment"
import ProjectSimpleStats from "./ProjectSimpleStats"
import NoDeployment from "./NoDeployment"
import { Logs } from "@/components/LogsComponent"
import { Project } from "@/types/Project"
import { Deployment } from "@/types/Deployment"

interface TabProjectProps {
	project: Project
	deployment?: Deployment
	tempDeployment?: Deployment
	onCreateDeployment: () => void
	setShowBuild: (state: boolean) => void;
	showBuild: boolean
	setTabs: (state: string) => void;
	reDeploy: () => void;
	refetchLogs: () => void;

}


const TabProject = ({ project, deployment, tempDeployment, onCreateDeployment, setShowBuild, showBuild, setTabs, reDeploy, refetchLogs }: TabProjectProps) => {

	return (
		<>
			<div className="dark:bg-neutral-900 border bg-white w-full rounded-md mb-6 mt-4 p-4">

				{(project.deployments && project.deployments.length === 0) && (
					<NoDeployment onCreateDeployment={onCreateDeployment} />
				)}

				<ProjectOverview
					project={project}
					deployment={deployment}
					reDeploy={reDeploy}
					setShowBuild={setShowBuild}
					goToSettings={() => setTabs("settings")}
				/>

				<div className="border dark:border-neutral-700 mt-2 border-neutral-300 rounded-md">
					<button
						className="p-4 w-full"
						onClick={() => setShowBuild(!showBuild)}
					>
						<span className="flex flex-row-reverse gap-2 items-center justify-end text-primary">
							Build Logs
							<MdKeyboardArrowRight
								className="size-6 transition-all duration-200"
								style={{
									transform: `rotateZ(${showBuild ? "90deg" : "0deg"})`,
								}}
							/>
						</span>
					</button>

					<AnimatePresence mode="sync">
						{showBuild && (
							<motion.div
								initial={{ opacity: 0, y: 20, height: 0 }}
								animate={{ opacity: 1, y: 0, height: "auto", }}
								exit={{ opacity: 0, y: -40, height: 0 }}
								transition={{ duration: 0.4, ease: "easeInOut" }}
								className="dark:bg-stone-900 bg-stone-100 h-auto"
							>
								<Logs deploymentId={deployment?._id || ""} refetch={refetchLogs} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{project.tempDeployment && project.deployments && project.deployments?.length > 0 && tempDeployment && (
				<ProjectCurrentDeployment
					deployment={tempDeployment}
					projectBranch={project.branch}
					repoURL={project.repoURL}
					showLogs={() => setShowBuild(true)}
					isCurrent={false}
				/>
			)}

			{project.deployments && project.deployments?.length > 0 && deployment && (
				<ProjectCurrentDeployment
					deployment={deployment}
					projectBranch={project.branch}
					repoURL={project.repoURL}
					showLogs={() => setShowBuild(true)}
					isCurrent={true}
				/>
			)}

			{project.deployments && project.deployments?.length > 0 && <ProjectSimpleStats />}
		</>
	)
}
export default TabProject