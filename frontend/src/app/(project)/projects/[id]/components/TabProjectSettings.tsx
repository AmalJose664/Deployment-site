import { Input } from "@/components/ui/input"
import { Project, ProjectFormInput } from "@/types/Project"
import { User } from "@/types/User"
import { useMemo, useState } from "react"
import { LuEye } from "react-icons/lu";
import { IoClipboardOutline } from "react-icons/io5";
import DisableProject from "@/components/project/DisableProject";
import { DeleteProjectDialog } from "@/components/project/DeleteProject";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectFormSchema } from "@/lib/schema/project";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBranches } from "@/lib/form";



const Details = ({ project, form, branches }: { project: Project, form: UseFormReturn<Omit<ProjectFormInput, "repoURL">>, branches: string[] | null }) => {
	const { formState: { errors } } = form
	const { getValues, register, formState } = form
	const { isValid, errors: errors2 } = formState
	const [isUpdateMode, setIsUpdateMode] = useState(false)

	const changeMode = (condition: boolean) => {
		setIsUpdateMode(condition)
	}
	const saveFn = () => {
		console.log(errors, isValid, errors2)
		if (isValid) {
			console.log(getValues("branch"))
			changeMode(false)
		}
	}
	return (

		<div className="dark:bg-neutral-900 bg-white rounded-md py-2 px-4 border">
			<h2 className="text-2xl mb-2">Details</h2>
			<div className="border py-3 rounded-md overflow-hidden">
				<div className="mb-3 px-3">
					<h2 className="text-xl font-medium">Project info</h2>
				</div>
				<hr />
				<AnimatePresence mode="wait" initial={false}>

					{isUpdateMode
						? ((
							<motion.div
								key="view-mode"
								initial={{ x: -100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: 100, opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="flex gap-2 flex-col p-3">
								<div className="px-2">
									<label htmlFor="">Name</label>
									<Input {...register("name")} />
									{errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
								</div>
								<div className="px-2">
									<label htmlFor="">Branch</label>
									<Controller
										control={form.control}
										name="branch"
										render={({ field }) => (
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<SelectTrigger className="w-full text-primary dark:placeholder:text-[#474747] placeholder:text-[#bdbdbd]">
													<SelectValue placeholder="main" />
												</SelectTrigger>
												<SelectContent>
													{branches
														? branches.map((branch, index) => (
															<SelectItem key={index} value={branch}>
																{branch}
															</SelectItem>
														))
														: <SelectItem value="main">main</SelectItem>
													}
												</SelectContent>
											</Select>
										)}
									/>
									{errors.branch && <p className="text-sm text-red-500 mt-1">{errors.branch.message}</p>}
								</div>
							</motion.div>
						)
						)
						: (
							<motion.div
								key="edit-mode"
								initial={{ x: 100, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -100, opacity: 0 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="flex gap-2 flex-col p-3">
								<div className="overflow-hidden">
									<table className="w-full text-left">
										<tbody >
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Name</td>
												<td className="px-4 py-2 text-primary">
													{getValues().name}
												</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Owner</td>
												<td className="px-4 py-2 text-primary">{(project.user as User).name}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Slug</td>
												<td className="px-4 py-2 text-primary">{project.subdomain}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Project ID</td>
												<td className="px-4 py-2 text-primary">{project._id}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Git Repo</td>
												<td className="px-4 py-2 text-indigo-600">
													<a href={project.repoURL} target="_blank" rel="noopener noreferrer" className="hover:underline">
														{project.repoURL}
													</a>
												</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Repo branch</td>
												<td className="px-4 py-2 text-primary">{getValues().branch}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="px-4 py-2 text-primary font-medium">Created</td>
												<td className="px-4 py-2 text-primary">
													{new Date(project.createdAt).toDateString()}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</motion.div>
						)}
				</AnimatePresence>
				<Button onClick={() => changeMode(!isUpdateMode)} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
					{isUpdateMode ? "Cancel" : "Update Fields"}
				</Button>
				{isUpdateMode && <Button onClick={saveFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
					Save
				</Button>}
			</div>
		</div>
	)
}

const ProjectSettings = ({ project }: { project: Project }) => {
	const p = { ...project }
	const [branches, setBranches] = useState<string[] | null>(null)
	useMemo(() => getBranches("https://github.com/AmalJose664/friend-tester", setBranches), [project.repoURL])
	const form = useForm<Omit<ProjectFormInput, "repoURL">>({
		defaultValues: {
			name: project.name,
			branch: project.branch,
			installCommand: project.installCommand,
			buildCommand: project.buildCommand,
			rootDir: project.rootDir,
			outputDirectory: project.outputDirectory,
			env: project.env,
		},
		resolver: zodResolver(
			ProjectFormSchema.omit({ repoURL: true })
		),
	});
	const { handleSubmit } = form

	return (
		<div>
			<div className="px-2 py-3">
				<form className="flex flex-col gap-3 p-4" noValidate onSubmit={handleSubmit(() => "")}>

					<Details project={p} form={form} branches={branches} />

					<div className="dark:bg-neutral-900 bg-white rounded-md py-2 px-4 border">
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
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Base Directory</td>
												<td className="p-2 text-primary">{project.rootDir}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Build command</td>
												<td className="p-2 text-primary">{project.buildCommand}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Install command</td>
												<td className="p-2 text-primary">{project.installCommand}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Output Directory</td>
												<td className="p-2 text-primary">{project.outputDirectory}</td>
											</tr>
											<tr className="dark:odd:bg-[#111]  dark:even:bg-transparent odd:bg-transparent  even:bg-background">
												<td className="p-2 text-primary font-medium">Current Status</td>
												<td className="p-2 text-primary">{project.status}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<Button className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
								Update Fields
							</Button>
						</div>
					</div>


					<div className="dark:bg-neutral-900 bg-white rounded-md py-2 px-4 border">
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
						className="dark:bg-neutral-900 bg-white rounded-md py-3 px-5 border"
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
				</form>
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