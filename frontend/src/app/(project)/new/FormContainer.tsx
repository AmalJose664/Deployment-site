'use client'

import { ProjectFormInput } from "@/types/Project"
import { useForm, useFieldArray, UseFormReturn } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectFormSchema } from "@/lib/schema/project";
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react";

import { MdKeyboardArrowRight } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import axios from "axios";
import { useCreateProjectMutation } from "@/store/services/projectsApi";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { BaseSettings } from "./BasicDetails";
import { AdvancedSettings } from "./AdvancedDetails";
import { ConfigPreview } from "./ConfigPreview";


function ProjectForm() {
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
	const { handleSubmit, formState,
		watch
	} = form
	const { errors,
		isSubmitting, isSubmitSuccessful,
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
		<div className="min-h-screen bg-gradient-to-br from-background dark:via-neutral-800 via-neutral-100 to-background  text-primary">
			<header className="border-b border-gray-800/50 backdrop-blur-xl  sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-8 py-2">
					<div className="flex items-center gap-4">
						<button
							className="p-2.5  border rounded-xl transition-all duration-200 "
						>
							<FaArrowLeft size={20} />
						</button>
						<div>
							<h1 className="text-2xl font-bold">Create New Project</h1>
							<p className="text-sm text-gray-400 mt-1">Deploy your application in minutes</p>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-8 py-3">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
					<motion.form
						className="mt-6 border p-2 rounded-md border-blue-600/30"
						noValidate
						onSubmit={handleSubmit(onSubmit)}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					>
						<BaseSettings form={form} branches={branches || []} />

						<div className="px-4 my-4 group transition-all duration-200">
							<span title="Show Advanced" className="transition-all duration-200 cursor-pointer hover:underline flex items-center gap-2"
								onClick={() => setShowAdvanced(!showAdvanced)}
							>
								<CiSettings
									className="size-5 group-hover:translate-x-2 transition-all duration-200 group-hover:rotate-45" /> Advanced Settings <MdKeyboardArrowRight
									className="inline duration-200" style={{ transform: `rotateZ(${showAdvanced ? "90" : "0"}deg)` }} />
							</span>
						</div>
						<AnimatePresence mode="sync">
							{showAdvanced && (
								<AdvancedSettings form={form} />
							)}
						</AnimatePresence>
						<div className="mb-4  ">
							<button
								type="submit"
								disabled={isSubmitting || isSubmitSuccessful}
								className="w-full dark:bg-background bg-white  py-2 hover:bg-neutral-800 hover:text-white hover:dark:bg-neutral-200 hover:dark:text-black rounded font-semibold border   transition"
							>
								{(isSubmitting || isLoading) ? "Loading..." : "Deploy"}
							</button>
						</div>
					</motion.form>



					{/* ----------------------------------------------------------------------- */}



					<ConfigPreview form={form} />
				</div>
			</main>
		</div>
	);
}


export default ProjectForm