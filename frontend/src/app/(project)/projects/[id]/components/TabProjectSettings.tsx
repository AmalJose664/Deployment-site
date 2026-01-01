import { LuEye } from "react-icons/lu";
import { IoClipboardOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { Input } from "@/components/ui/input"
import { Project, ProjectFormInput } from "@/types/Project"
import { User } from "@/types/User"
import { JSX, memo, useEffect, useMemo, useState } from "react"

import DisableProject from "@/components/modals/DisableProject";
import { DeleteProjectDialog } from "@/components/modals/DeleteProject";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react"
import { ProjectFormSchema } from "@/lib/schema/project";
import { Controller, useFieldArray, useForm, UseFormReturn, useFormState, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBranches } from "@/lib/moreUtils/form";
import { useUpdateProjectMutation } from "@/store/services/projectsApi";
import { ChangeProjectSubdomainDialog } from "@/components/modals/ChangeSubdomain";
import RightFadeComponent from "@/components/RightFadeComponent";
import { LoadingSpinner2 } from "@/components/LoadingSpinner";




const DetailRow = ({ label = "", value = "", isLink = false }: { label?: string, value?: string, isLink?: boolean }) => (
	<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 px-4 py-3 
	transition-colors duration-75 border-b dark:border-b-background hover:bg-secondary">
		<div className="sm:w-40 shrink-0">
			<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
				{label}
			</span>
		</div>
		<div className="flex-1">
			{isLink ? (
				<a
					href={value}
					target="_blank"
					rel="noopener noreferrer"
					className="text-blue-400 hover:underline text-sm break-all"
				>
					{value}
				</a>
			) : (
				<span className="text-sm text-gray-900 dark:text-gray-100 break-all">
					{value}
				</span>
			)}
		</div>
	</div>
);


const Details = ({ project, form, branches }: { project: Project, form: UseFormReturn<Omit<ProjectFormInput, "repoURL">>, branches: string[] | null }) => {
	const { errors } = useFormState({
		control: form.control,
		name: ['name', 'branch']
	})
	const { register } = form

	const [isUpdateMode, setIsUpdateMode] = useState(false)

	const changeMode = (condition: boolean) => {
		setIsUpdateMode(condition)
	}
	const cancelFn = () => {
		form.resetField("name")
		form.resetField("branch")
		changeMode(false)
	}
	const saveFn = async () => {
		await form.trigger("name")
		await form.trigger("branch")
		if (!!(errors.name || errors.branch)) {
			toast.warning("Errors in fields")
			return
		}
		changeMode(false)
	}
	const name = useWatch({ control: form.control, name: 'name' })
	const branch = useWatch({ control: form.control, name: 'branch' })
	const memoizedBranchItems = useMemo(() => {
		return branches
			? branches.map((branch, index) => (
				<SelectItem key={index} value={branch}>
					{branch}
				</SelectItem>
			))
			: [<SelectItem key="main" value="main">main</SelectItem>];
	}, [branches]);
	const BranchSelect = memo(({ branches }: { branches: JSX.Element[] }) => {
		return (
			<Controller
				control={form.control}
				name="branch"
				render={({ field }) => (
					<Select onValueChange={field.onChange} defaultValue={field.value}>
						<SelectTrigger className="w-full text-primary dark:placeholder:text-[#474747] placeholder:text-[#bdbdbd]">
							<SelectValue placeholder="main" />
						</SelectTrigger>

						<SelectContent>
							{branches}
						</SelectContent>
					</Select>
				)}
			/>
		);
	});
	return (

		<RightFadeComponent className="dark:bg-neutral-900 bg-white rounded-md py-3 px-5 border mb-3">
			<h2 className="text-xl mb-2">Project Details</h2>
			<div className="border pb-4 rounded-md overflow-hidden">
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
									<BranchSelect branches={memoizedBranchItems} />
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
								className="flex gap-2 flex-col">
								<div className="w-full overflow-hidden p-3">
									<div className="bg-white dark:bg-transparent rounded-lg shadow-sm border">
										<div className="">
											<DetailRow label="Name" value={name} />
											<DetailRow label="Owner" value={(project.user as User).name} />
											<DetailRow label="Slug" value={project.subdomain} />
											<DetailRow label="Project ID" value={project._id} />
											<DetailRow label="Git Repo" value={project.repoURL} isLink={true} />
											<DetailRow label="Repo branch" value={branch || ''} />
											<DetailRow label="Created" value={new Date(project.createdAt).toDateString()} />
										</div>
									</div>
								</div>
							</motion.div>
						)}
				</AnimatePresence>
				{isUpdateMode ? (
					<>
						<Button onClick={cancelFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
							Cancel
						</Button>
						<Button onClick={saveFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
							Save
						</Button>
					</>
				) : <Button onClick={() => changeMode(!isUpdateMode)} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
					Update Fields
				</Button>}
			</div>
		</RightFadeComponent >
	)
}

const Configurations = ({ project, form }: { project: Project, form: UseFormReturn<Omit<ProjectFormInput, "repoURL">>, }) => {
	const { errors } = useFormState({
		control: form.control,
		name: ['rootDir', 'buildCommand', 'installCommand', 'outputDirectory']
	})
	const { register, } = form
	const [isUpdateMode, setIsUpdateMode] = useState(false)

	const changeMode = (condition: boolean) => {
		setIsUpdateMode(condition)
	}
	const cancelFn = () => {
		form.resetField("buildCommand")
		form.resetField("rootDir")
		form.resetField("outputDirectory")
		form.resetField("installCommand")

		changeMode(false)
	}
	const saveFn = async () => {
		await form.trigger("buildCommand")
		await form.trigger("outputDirectory")
		await form.trigger("rootDir")
		await form.trigger("installCommand")
		if (!!(errors.buildCommand || errors.installCommand || errors.rootDir || errors.outputDirectory)) {
			toast.warning("Errors in fields")
			return
		}
		changeMode(false)
	}
	const rootDir = useWatch({ control: form.control, name: 'rootDir' })
	const buildCommand = useWatch({ control: form.control, name: 'buildCommand' })
	const installCommand = useWatch({ control: form.control, name: 'installCommand' })
	const outputDirectory = useWatch({ control: form.control, name: 'outputDirectory' })

	return (
		<RightFadeComponent delay={.1} className="dark:bg-neutral-900 bg-white rounded-md py-3 px-5 border mb-3">
			<h2 className="text-xl mb-2">Build Settings</h2>
			<div className="border pb-4 rounded-md overflow-hidden">
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
									<label htmlFor="">Base Directory</label>
									<Input {...register("rootDir")} />
									{errors.rootDir && <p className="text-sm text-red-500 mt-1">{errors.rootDir.message}</p>}
								</div>
								<div className="px-2">
									<label htmlFor="">Build Command</label>
									<Input {...register("buildCommand")} />
									{errors.buildCommand && <p className="text-sm text-red-500 mt-1">{errors.buildCommand.message}</p>}
								</div>
								<div className="px-2 relative group">
									<label htmlFor="">Install Commands</label>
									<Input {...register("installCommand")} disabled />
									{errors.installCommand && <p className="text-sm text-red-500 mt-1">{errors.installCommand.message}</p>}
									<div
										className="absolute -top-16 left-1/6 -translate-x-1/2 w-44 px-3 py-2 text-sm text-secondary 
								bg-accent-foreground border rounded-md shadow-md 
								opacity-0 invisible
								group-hover:opacity-100 group-hover:visible
								transition-opacity duration-200
								delay-500
								pointer-events-none
								">Editing Install command is currently disabled
									</div>
								</div>
								<div className="px-2">
									<label htmlFor="">Outputs Directory</label>
									<Input {...register("outputDirectory")} />
									{errors.outputDirectory && <p className="text-sm text-red-500 mt-1">{errors.outputDirectory.message}</p>}
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

								<div className="w-full overflow-hidden">
									<div className="bg-white dark:bg-transparent rounded-lg shadow-sm border">
										<div className="">
											<DetailRow label="Base Directory" value={rootDir} />
											<DetailRow label="Build command" value={buildCommand} />
											<DetailRow label="Install command" value={installCommand} />
											<DetailRow label="Outputs Directory" value={outputDirectory} />
											<DetailRow label="Current Status" value={project.status} />
										</div>
									</div>
								</div>
							</motion.div>
						)}
				</AnimatePresence>

				{isUpdateMode ? (
					<>
						<Button onClick={cancelFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
							Cancel
						</Button>
						<Button onClick={saveFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
							Save
						</Button>
					</>
				) : <Button onClick={() => changeMode(!isUpdateMode)} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
					Update Fields
				</Button>}
			</div>
		</RightFadeComponent >
	)
}

const EnvVariables = ({ project, form }: { project: Project, form: UseFormReturn<Omit<ProjectFormInput, "repoURL">>, }) => {
	const { errors } = useFormState({
		control: form.control,
		name: ['env']
	})
	const { register, control } = form
	const [isUpdateMode, setIsUpdateMode] = useState(false)

	const { fields, append, remove } = useFieldArray({
		name: "env",
		control
	})
	const changeMode = (condition: boolean) => {
		setIsUpdateMode(condition)
	}
	const cancelFn = () => {
		form.resetField("env")
		changeMode(false)
	}
	const saveFn = async () => {
		await form.trigger("env")
		if (!!(errors.env)) {
			toast.warning("Errors in fields")
			return
		}
		changeMode(false)
	}
	const env = useWatch({ control: form.control, name: 'env' }) || []

	return (

		<RightFadeComponent delay={.17} className="dark:bg-neutral-900 bg-white rounded-md py-3 px-5 border mb-3">
			<h2 className="text-xl mb-2">Environment Vars</h2>
			<div className="border pb-4 rounded-md overflow-hidden">

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
									<button
										type="button"
										onClick={() => append(
											{ name: "", value: "" }
										)}
										className="flex float-end mb-4 mt-2 mr-4 items-center gap-2 text-sm  px-4 py-2 rounded-md transition-all border border-gray-700/50"
									>
										<FaPlus size={16} />
										Add Variable
									</button>
									{fields && fields.length > 0 ? (
										<div className="space-y-3">
											{fields.map((field, index) => (
												<motion.div
													initial={{ y: 20, opacity: 0 }}
													animate={{ y: 0, opacity: 1 }}
													transition={{ duration: 0.4, ease: "easeInOut" }} className="flex gap-2 flex-col items-center justify-between form-control w-full" key={field.id}>

													<div className="flex gap-2 items-center justify-between w-full">
														<Input placeholder="name" className="text-primary mb-2" type="text" {...register(`env.${index}.name`)}
														/>
														<Input placeholder="value" className="text-primary mb-2" type="text" {...register(`env.${index}.value`)}
														/>
														{
															index >= 0 && (
																<button className="border rounded-sm hover:border-primary" type="button" onClick={
																	() => remove(index)}><IoIosClose /></button>
															)
														}
													</div>
													{errors.env?.[index]?.name && (
														<p className="text-sm text-red-500">{errors.env[index].name.message}</p>
													)}
													{errors.env?.[index]?.value && (
														<p className="text-sm text-red-500">{errors.env[index].value.message}</p>
													)}
												</motion.div>

											))}
										</div>
									) : (
										<div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-800 rounded-md">
											No environment variables added yet
										</div>
									)}
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
								<div className="flex gap-2 flex-col p-3">
									{env.length !== 0 ? (
										env.map((env, index) => <RenderEnv key={index} env={env} index={index} />)
									) : (
										<p className="text-sm">No env set</p>
									)}
								</div>
							</motion.div>
						)}
				</AnimatePresence>
				{isUpdateMode ? (
					<>
						<Button onClick={cancelFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
							Cancel
						</Button>
						<Button onClick={saveFn} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
							Save
						</Button>
					</>
				) : <Button onClick={() => changeMode(!isUpdateMode)} className="border ml-4 text-sm px-3 py-1 rounded-md " size="sm">
					Update Fields
				</Button>}
			</div>
		</RightFadeComponent>
	)
}

const SaveBar = memo(({ control, handleSubmit, saveAndDeploy }: { control: any, handleSubmit: (data: any) => any, saveAndDeploy: (data: Omit<ProjectFormInput, "repoURL">) => void }) => {
	const isDirty = useFormState({ control }).isDirty

	return isDirty ? (
		<div className="flex ml-auto mr-2 gap-3 items-center">
			{isDirty && <p className="text-sm text-red-300"> unsaved changes</p>}
			<Button
				type="button"
				onClick={handleSubmit(saveAndDeploy)}
			>
				Save and Deploy
			</Button>
			<Button type="submit">
				Save Only
			</Button>
		</div>

	) : null
})


const ProjectSettings = ({ project, reDeploy, setTabs }: { project: Project, reDeploy: () => Promise<void>, setTabs: (state: string) => void }) => {

	const [branches, setBranches] = useState<string[] | null>(null)
	useEffect(() => {
		getBranches(project.repoURL, setBranches)
	}, [project.repoURL])
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
	const [updateProject, { isLoading, error, }] = useUpdateProjectMutation()
	const { handleSubmit, formState: { dirtyFields } } = form

	function getDirtyValues<T extends Record<string, any>>(
		dirty: Partial<Record<keyof T, boolean>>,
		values: T
	): Partial<T> {
		const fields = Object.fromEntries(
			Object.keys(dirty)
				.map((key) =>
					dirty[key as keyof T] === true
						? [key, values[key as keyof T]]
						: null
				)
				.filter((entry): entry is [string, T[keyof T]] => entry !== null)
		) as Partial<T>;
		if (values?.env?.length !== 0) {
			(fields as any).env = values.env
		}
		return fields
	}

	const saveData = async (data: Omit<ProjectFormInput, "repoURL">) => {
		try {
			const changed = getDirtyValues<Omit<ProjectFormInput, "repoURL">>(dirtyFields as any, data)
			console.log({ changed, dirtyFields, data })

			await updateProject({ _id: project._id, ...changed }).unwrap()
			toast.success("Settings saved!")
			form.reset(data)
		} catch (error: any) {
			toast.error("Failed to save ", error.data.message || error.message)
		}
	}

	const saveAndDeploy = async (data: Omit<ProjectFormInput, "repoURL">) => {
		await saveData(data)
		await reDeploy()
		setTabs("project")
	}
	return (
		<div className="">
			<div className="">
				<form className="flex flex-col gap-3 p-4" noValidate onSubmit={handleSubmit(saveData)}>
					<LoadingSpinner2 isLoading={isLoading} />
					<SaveBar control={form.control} handleSubmit={handleSubmit} saveAndDeploy={saveAndDeploy} />

					<Details project={project} form={form} branches={branches} />
					<Configurations project={project} form={form} />
					<EnvVariables project={project} form={form} />


					<div
						id="subdomain"
						className="dark:bg-neutral-900 bg-white rounded-md py-3 px-5 border mb-3"
					>
						<h2 className="text-xl mb-3 font-semibold text-primary">Domain</h2>
						<div className="flex border items-center justify-between p-4 rounded-md">
							<div>
								<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
									Change Subdomain
								</p>
								<p className="text-xs text-gray-500">
									Change the subdomain.
								</p>
							</div>
							<ChangeProjectSubdomainDialog projectId={project._id} projectName={project.name} currentSubdomain={project.subdomain} />
						</div>
					</div>
					<div
						id="danger"
						className="dark:bg-neutral-900 bg-white rounded-md py-3 px-5 border mb-3"
					>
						<h2 className="text-xl mb-3 font-semibold text-red-500">Danger</h2>
						<div className="border rounded-md p-4 space-y-4">
							<div className="flex items-center justify-between" id="disable">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
										Disable Project
									</p>
									<p className="text-xs text-gray-500">
										Disable this project so that no one can access it.
									</p>
								</div>
								<DisableProject projectId={project._id} isDisabled={project.isDisabled} />
							</div>
							<div className="flex items-center justify-between" id="delete">
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
			<button type="button" onClick={() => setShowEnv(!showEnv)}><LuEye className={showEnv ? "opacity-100" : "opacity-50"} /></button>
			<button type="button" onClick={() => {
				navigator.clipboard.writeText(env.value)
				toast.info("Env value copied")
			}}><IoClipboardOutline /></button>

		</div>
	)

}