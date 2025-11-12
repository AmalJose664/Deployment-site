import { Input } from "@/components/ui/input"
import { Project } from "@/types/Project"
import { User } from "@/types/User"
import { useState } from "react"
import { LuEye } from "react-icons/lu";
import { IoClipboardOutline } from "react-icons/io5";
import DisableProject from "@/components/DisableProject";
import { DeleteProjectDialog } from "@/components/DeleteProject";
import { toast } from "sonner"

const ProjectSettings = ({ project }: { project: Project }) => {
	return (
		<div>
			<div className="px-2 py-3">
				<div className="flex flex-col gap-3 p-4">

					<div className="dark:bg-[#111111] bg-white rounded-md py-2 px-4 border">
						<h2 className="text-2xl mb-2">Details</h2>
						<div className="border py-3 rounded-md">
							<div className="mb-3 px-3">
								<h2 className="text-xl font-medium">Project info</h2>
							</div>
							<hr />
							<div className="flex gap-2 flex-col p-3">
								<div className="overflow-hidden">
									<table className="w-full text-left">
										<tbody >
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Name</td>
												<td className="px-4 py-2 text-primary">{project.name}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Owner</td>
												<td className="px-4 py-2 text-primary">{(project.user as User).name}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Slug</td>
												<td className="px-4 py-2 text-primary">{project.subdomain}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Project ID</td>
												<td className="px-4 py-2 text-primary">{project._id}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Git Repo</td>
												<td className="px-4 py-2 text-indigo-600">
													<a href={project.repoURL} target="_blank" rel="noopener noreferrer" className="hover:underline">
														{project.repoURL}
													</a>
												</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Repo branch</td>
												<td className="px-4 py-2 text-primary">{project.branch}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Created</td>
												<td className="px-4 py-2 text-primary">
													{new Date(project.createdAt).toDateString()}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<div className="dark:bg-[#111111] bg-white rounded-md py-2 px-4 border">
						<h2 className="text-2xl mb-2">Build Settings</h2>
						<div className="border py-3 rounded-md">
							<div className="mb-3 px-3">
								<h2 className="text-xl font-medium">Info</h2>
							</div>
							<hr />
							<div className="flex gap-2 flex-col p-3">
								<div className="overflow-hidden">
									<table className="w-full text-left">
										<tbody className="w-[50%]">
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Base Directory</td>
												<td className="p-2 text-primary">{project.rootDir}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Build command</td>
												<td className="p-2 text-primary">{project.buildCommand}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Install command</td>
												<td className="p-2 text-primary">{project.installCommand}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Output Directory</td>
												<td className="p-2 text-primary">{project.outputDirectory}</td>
											</tr>
											<tr className="dark:odd:bg-background  dark:even:bg-[#121211] odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Current Status</td>
												<td className="p-2 text-primary">{project.status}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>




					<div className="dark:bg-[#111111] bg-white rounded-md py-2 px-4 border">
						<h2 className="text-2xl mb-2">Environment Vars</h2>
						<div className="border py-3 rounded-md">
							<div className="mb-3 px-3">
								<h2 className="text-xl font-medium">Variables</h2>
							</div>
							<hr />
							<div className="flex gap-2 flex-col p-3">
								{project.env.length !== 0 ? (
									project.env.map((env, index) => <RenderEnv key={index} env={env} index={index} />)
								) : (
									<p className="text-sm">No env set</p>
								)}
							</div>
						</div>
					</div>


					<div
						id="danger"
						className="dark:bg-[#111111] bg-white rounded-md py-3 px-5 border"
					>
						<h2 className="text-xl mb-3 font-semibold text-red-500">Danger</h2>

						<div className="border rounded-md p-4 space-y-4">

							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
										Disable Project
									</p>
									<p className="text-xs text-gray-500">
										Disable this project so that no one can access it.
									</p>
								</div>
								<DisableProject projectId={project._id} />
							</div>

							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
										Delete Project
									</p>
									<p className="text-xs text-gray-500">
										Permanently delete this project and all data.
									</p>
								</div>
								<DeleteProjectDialog projectId={project._id} projectName={project.name} />
							</div>
						</div>
					</div>




				</div>
			</div>
		</div>
	)
}
export default ProjectSettings


function RenderEnv({ env, index }: { env: Project['env'][number], index: number }) {

	const [showEnv, setShowEnv] = useState(false)
	return (
		<div key={index} className="flex gap-2 items-center ">
			<span style={{ fontFamily: "Consolas, 'Fira Code', 'Source Code Pro', monospace" }} className="border px-3 py-2 rounded-md ">{env.name}</span>
			<Input readOnly className="w-auto text-primary" type={showEnv ? "text" : "password"} value={env.value} style={{ fontFamily: "Consolas, 'Fira Code', 'Source Code Pro', monospace" }} />
			<button onClick={() => setShowEnv(!showEnv)}><LuEye /></button>
			<button onClick={() => {
				navigator.clipboard.writeText(env.value)
				toast.info("Env value copied")
			}}><IoClipboardOutline /></button>

		</div>
	)

}