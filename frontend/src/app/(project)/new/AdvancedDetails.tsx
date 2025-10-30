'use client'

import { Input } from "@/components/ui/input"
import { ProjectFormInput } from "@/types/Project"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { motion } from "motion/react"

import { FiTerminal } from "react-icons/fi";
import { VscSymbolVariable } from "react-icons/vsc";
import { IoIosClose } from "react-icons/io";
import { CiFolderOn } from "react-icons/ci";
import { LiaWrenchSolid } from "react-icons/lia";
import { FaPlus } from "react-icons/fa";


export function AdvancedSettings({ form }: {
	form: UseFormReturn<ProjectFormInput>
}) {
	const { register, formState: { errors }, control } = form
	const { fields, append, remove } = useFieldArray({
		name: "env",
		control
	})
	return (
		<>
			<motion.div
				initial={{ opacity: 0, height: 0 }}

				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: 0.4, ease: "easeInOut" }}
				className="border px-4 py-3 mb-6 rounded-md  overflow-hidden dark:bg-background bg-white border-gray-800/50  p-6 backdrop-blur-sm space-y-5"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 border rounded-md">
							<VscSymbolVariable size={18} />
						</div>
						<h2 className="text-lg font-bold">Environment Variables</h2>
					</div>
					<button
						type="button"
						onClick={() => append(
							{ name: "", value: "" }
						)}
						className="flex items-center gap-2 text-sm  px-4 py-2 rounded-md transition-all border border-gray-700/50"
					>
						<FaPlus size={16} />
						Add Variable
					</button>
				</div>

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

			</motion.div>

			<motion.div
				initial={{ opacity: 0, height: 0 }}

				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: 0.4, ease: "easeInOut" }}
				className="border px-4 py-3 mb-6 rounded-md overflow-hidden dark:bg-background bg-white 	 p-6 backdrop-blur-sm space-y-5"
			>
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 border rounded-md">
						<LiaWrenchSolid size={18} />
					</div>
					<h2 className="text-lg font-bold">Build Configuration</h2>
				</div>

				<div className="mb-3 px-3 py-2">
					<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
						<CiFolderOn />{" "}<span className="text-primary">Root Directory</span>
					</label>
					<Input {...register("rootDir")} className="text-primary" />
					{errors.rootDir && <p className="text-sm text-red-500 mt-1">{errors.rootDir.message}</p>}
					<p className="text-xs text-gray-500 mt-2">
						The directory within your project where the code is located
					</p>
				</div>

				<div className="mb-3 px-3 py-2 relative">
					<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
						<FiTerminal />{" "}<span className="text-primary">Install Command </span>
					</label>
					<span className="absolute top-[38px] left-6">npm</span>
					<Input maxLength={20} {...register("installCommand")} className="text-primary pl-13" />
					{errors.installCommand && <p className="text-sm text-red-500 mt-1">{errors.installCommand.message}</p>}
					<p className="text-xs text-gray-500 mt-2">
						Command to install dependencies (e.g., npm install, yarn)
					</p>
				</div>

				<div className="mb-3 px-3 py-2 relative">
					<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
						<FiTerminal />{" "}<span className="text-primary">Build Command</span>
					</label>
					<span className="absolute top-[38px] left-6">npm</span>
					<Input maxLength={20} {...register("buildCommand")} className="text-primary pl-13" />
					{errors.buildCommand && <p className="text-sm text-red-500 mt-1">{errors.buildCommand.message}</p>}
					<p className="text-xs text-gray-500 mt-2">
						Command to build your project (e.g., npm run build)
					</p>
				</div>

				<div className="mb-3 px-3 py-2">
					<label className="flex items-center gap-2  mb-1 font-medium text-sm" htmlFor="">
						<CiFolderOn />{" "}<span className="text-primary">Output Directory
						</span>
					</label>
					<Input {...register("outputDirectory")} className="text-primary" />
					{errors.outputDirectory && <p className="text-sm text-red-500 mt-1">{errors.outputDirectory.message}</p>}
					<p className="text-xs text-gray-500 mt-2">
						The directory where your compiled code will be output
					</p>
				</div>

			</motion.div>

		</>
	)
}
