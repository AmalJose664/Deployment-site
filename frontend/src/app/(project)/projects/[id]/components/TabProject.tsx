import { AnimatePresence, motion } from "motion/react"
import { MdKeyboardArrowRight } from "react-icons/md"
import ProjectOverview from "./ProjectOverview"
import ProjectDeploymentBox from "./ProjectDeploymentBox"
import ProjectSimpleStats from "./ProjectSimpleStats"
import NoDeployment from "./NoDeployment"
import { Logs } from "@/components/LogsComponent"
import { Project } from "@/types/Project"
import { Deployment } from "@/types/Deployment"
import { IoRocketOutline } from "react-icons/io5"

interface TabProjectProps {
	project: Project
	deployment?: Deployment
	tempDeployment?: Deployment
	lastDeployment?: Deployment
	onCreateDeployment: () => void
	setShowBuild: (state: boolean) => void;
	showBuild: boolean
	setTabs: (state: string) => void;
	reDeploy: () => void;
	refetchLogs: () => void;

}


const TabProject = ({ project, deployment, tempDeployment, lastDeployment, onCreateDeployment, setShowBuild, showBuild, setTabs, reDeploy, refetchLogs }: TabProjectProps) => {
	return (
		<>
			<div className="dark:bg-neutral-900 border bg-white w-full rounded-md mb-6 mt-4 p-4">

				{(project.deployments && project.deployments.length === 0 && !lastDeployment) && (
					<NoDeployment
						buttonAction={onCreateDeployment}
						titleText="No Deployments Yet"
						descriptionText="You haven&apos;t created any project deployment yet. Run your project by creating your new Deployment."
						buttonText="Create Deployment"
						buttonIcon={<IoRocketOutline />}
						learnMoreUrl="#"
					/>
				)}


				<ProjectOverview
					project={project}
					deployment={deployment || lastDeployment}
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
							<span className="text-xs mt-2">
								{`( ${deployment?._id ? "Current Deployment" : lastDeployment?._id ? "Last Deployment" : ""}  )`}
							</span>
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
				<ProjectDeploymentBox
					deployment={tempDeployment}
					projectBranch={project.branch}
					repoURL={project.repoURL}
					showLogs={() => setShowBuild(true)}
					type={"Progress"}
				/>
			)}

			{project.deployments && project.deployments?.length > 0 && deployment && (
				<ProjectDeploymentBox
					deployment={deployment}
					projectBranch={project.branch}
					repoURL={project.repoURL}
					showLogs={() => setShowBuild(true)}
					type={"Current"}
				/>
			)}

			{project.lastDeployment && project.deployments && project.deployments?.length > 0 && lastDeployment && !deployment && (
				<ProjectDeploymentBox
					deployment={lastDeployment}
					projectBranch={project.branch}
					repoURL={project.repoURL}
					showLogs={() => setShowBuild(true)}
					type={"Last"}
				/>
			)}
			{project.deployments && project.deployments?.length > 0 && <ProjectSimpleStats />}
		</>
	)
}
export default TabProject