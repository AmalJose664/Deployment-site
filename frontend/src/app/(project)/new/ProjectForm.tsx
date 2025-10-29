'use client'

import { Input } from "@/components/ui/input"
import { ProjectFormInput } from "@/types/Project"
import { useForm, useFieldArray, FieldErrors } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormSchema } from "@/lib/schema/project";
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react";

import { MdKeyboardArrowRight } from "react-icons/md";
import { LuGithub } from "react-icons/lu";
import { FiTerminal } from "react-icons/fi";
import { IoIosGitBranch } from "react-icons/io";
import { VscSymbolVariable } from "react-icons/vsc";
import { IoIosClose } from "react-icons/io";
import { CiFolderOn } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import axios from "axios";
import { useCreateProjectMutation } from "@/store/services/projectsApi";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";

const ProjectForm = () => {
	const router = useRouter()
	const form = useForm<ProjectFormInput>({

		defaultValues: {
			name: 'new-ui-projectsqq',
			repoURL: '',
			branch: "main",
			installCommand: "install",
			buildCommand: "build",
			rootDir: "./",
			outputDirectory: 'dist'
		},

		resolver: zodResolver(ProjectFormSchema)
	})
	const [createProject, { isLoading, isSuccess }] = useCreateProjectMutation()

	const [showAdvanced, setShowAdvanced] = useState(false)
	const [branches, setBranches] = useState<[string] | undefined>()

	const repoCheck = async (fieldValue: string) => {
		console.log("searching repo.....")
		const values = fieldValue.replace(/\/$/, "").split("/")
		const repoName = values[values.length - 1]
		const user = values[values.length - 2]
		if (!user || !repoName) return false
		try {
			const res = await axios.get("https://api.github.com/repos/" + user + "/" + repoName.replace(".git", ""))
			const data = res.data
			console.log(data, '<<<<')
			return res.status === 200
		} catch (error) {

			return false
		}
	}
	const { register,
		control,
		handleSubmit, formState,
		watch
	} = form
	const { errors, isDirty, isValid, isSubmitted,
		isSubmitting, isSubmitSuccessful, submitCount,
	} = formState

	const repoUrl = watch("repoURL")
	const getBranches = async () => {
		const repo = form.getValues("repoURL")
		if (!repo) return
		const values = repo.replace(/\/$/, "").split("/")
		const repoName = values[values.length - 1].replace(".git", "")
		const user = values[values.length - 2]
		if (!user || !repoName) return
		try {
			const res = await axios.get(`https://api.github.com/repos/${user}/${repoName}/branches`)
			const { data } = res
			const newData = data.map((d: any) => d.name)
			setBranches(newData)
		} catch (error) {
			console.log("Invalid git url")
		}
	}
	useEffect(() => {

		getBranches()
	}, [repoUrl])

	const { fields, append, remove } = useFieldArray({
		name: "env",
		control
	})


	const onSubmit = async (data: ProjectFormInput) => {
		const repoExists = await repoCheck(data.repoURL)
		if (!repoExists) {
			form.setFocus("repoURL")
			form.setError("repoURL", { message: "Git repo not found", type: "manual", })
			return
		} else {
			form.clearErrors("repoURL")
		}
		try {
			const result = await createProject(data).unwrap()
			router.push(`/projects/${result._id}`)

			console.log("Form submitted ", data)
		} catch (error) {
			console.log("Error!", error)
		}

	}


	return (
		<div>
			<motion.div className="flex flex-col items-center justify-around gap-4 py-10 w-full transition-all duration-200">
				<h3 className="text-pretty text-primary my-2">Create New</h3>
				<motion.div className="bg-card px-6 text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-2xl transition-all duration-200">
					<h4 className="text-pretty text-primary">Project Details</h4>

					<motion.form

						noValidate
						onSubmit={handleSubmit(onSubmit)}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					>
						<div className="border px-4 py-3  mb-6 rounded-xl">

							<div className="mb-3 px-3 py-2">
								<label className="block mb-1 font-medium text-sm" htmlFor="">Project Name</label>
								<Input {...register("name")} placeholder="My frontend..." className="text-primary dark:placeholder:text-[#474747] placeholder:text-[#bdbdbd]" />
								{errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
							</div>

							<div className="mb-3 px-3 py-2">
								<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
									< LuGithub />{" "}<span>Public Git url </span>
								</label>

								<Input {...register("repoURL")}
									placeholder="https://github.com/user/repo"
									className="text-primary dark:placeholder:text-[#474747] placeholder:text-[#bdbdbd]"
								/>

								{errors.repoURL && <p className="text-sm text-red-500 mt-1">{errors.repoURL.message}</p>}
							</div>
							<div className="mb-3 px-3 py-2">
								<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
									<IoIosGitBranch />{" "}<span>Branch</span>
								</label>

								<Select {...register("branch")}>
									<SelectTrigger className="w-full text-primary dark:placeholder:text-[#474747] placeholder:text-[#bdbdbd]">
										<SelectValue placeholder="main" />
									</SelectTrigger>
									<SelectContent>
										{branches ? branches.map((branch: string, index: number) => (
											<SelectItem key={index} value={branch}>{branch}</SelectItem>
										)) :
											<SelectItem value={"main"}>{"main"}</SelectItem>
										}
									</SelectContent>
								</Select>
								{errors.branch && <p className="text-sm text-red-500 mt-1">{errors.branch.message}</p>}
							</div>
						</div>

						<div className="px-4 mb-4">
							<span title="Show Advanced" className="cursor-pointer hover:underline flex items-center gap-2" onClick={() => setShowAdvanced(!showAdvanced)}
							><CiSettings className="size-5" /> Advanced Settings <MdKeyboardArrowRight className="inline duration-200" style={{ transform: `rotateZ(${showAdvanced ? "90" : "0"}deg)` }} /></span>
						</div>
						<AnimatePresence mode="sync">
							{showAdvanced && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}

									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.4, ease: "easeInOut" }}
									className="border px-4 py-3 bg-zinc-900 mb-6 rounded-xl overflow-hidden"
								>
									<div className="mb-3 px-3 py-2 relative">
										<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
											<FiTerminal />{" "}<span>Build Command</span>
										</label>
										<span className="absolute top-[38px] left-6">npm</span>
										<Input maxLength={20} {...register("buildCommand")} className="text-primary pl-13" />
										{errors.buildCommand && <p className="text-sm text-red-500 mt-1">{errors.buildCommand.message}</p>}
									</div>
									<div className="mb-3 px-3 py-2 relative">
										<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
											<FiTerminal />{" "}<span>Install Command </span>
										</label>
										<span className="absolute top-[38px] left-6">npm</span>
										<Input maxLength={20} {...register("installCommand")} className="text-primary pl-13" />
										{errors.installCommand && <p className="text-sm text-red-500 mt-1">{errors.installCommand.message}</p>}
									</div>

									<div className="mb-3 px-3 py-2">
										<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
											<CiFolderOn />{" "}<span>Root Directory</span>
										</label>
										<Input {...register("rootDir")} className="text-primary" />
										{errors.rootDir && <p className="text-sm text-red-500 mt-1">{errors.rootDir.message}</p>}
									</div>

									<div className="mb-3 px-3 py-2">
										<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
											<CiFolderOn />{" "}<span>Output Directory
											</span>
										</label>
										<Input {...register("outputDirectory")} className="text-primary" />
										{errors.outputDirectory && <p className="text-sm text-red-500 mt-1">{errors.outputDirectory.message}</p>}
									</div>
									<div className="mb-3 px-3 py-2">
										<button className="flex gap-2 items-center mb-2" type="button" onClick={() => append(
											{ name: "", value: "" }
										)}><VscSymbolVariable /> Add Enviroment Variables</button>
										{fields.map((field, index) => (
											<motion.div transition={{ duration: 0.4, ease: "easeInOut" }} className="flex gap-2 flex-col items-center justify-between form-control w-full" key={field.id}>

												<div className="flex gap-2 items-center justify-between w-full">
													<Input placeholder="name" className="text-primary mb-2" type="text" {...register(`env.${index}.name`)}
													/>

													<Input placeholder="value" className="text-primary mb-2" type="text" {...register(`env.${index}.value`)}
													/>

													{
														index >= 0 && (
															<button type="button" onClick={
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
								</motion.div>
							)}
						</AnimatePresence>
						<div className="mb-4 px-3 py-4">
							<button
								type="submit"
								// disabled={isSubmitting || isSubmitSuccessful}
								className="w-full py-2 rounded font-semibold border border-primary transition"
							>
								{(isSubmitting || isLoading) ? "Loading..." : "Deploy"}
							</button>
						</div>
					</motion.form>
				</motion.div>
			</motion.div>
		</div>

	)
}
export default ProjectForm

