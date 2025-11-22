"use client"

import { CiClock1, CiSearch } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IoMdGlobe, IoMdGitBranch } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { AnimatePresence, motion } from "motion/react"
import { useRef, useState } from 'react';
import { useGetProjectsQuery } from '@/store/services/projectsApi';
import { useDebounce } from '@/hooks/useDebounce';
import ProjectEmptyState from './ProjectEmptyState';
import { Project, ProjectStatus } from '@/types/Project';
import { useRouter } from "next/navigation"
import { cn, getStatusBg } from '@/lib/utils';
import { Input } from "@/components/ui/input";


export default function ProjectContent() {

	const router = useRouter()
	const [projectSeachState, setProjectSearchState] = useState("")
	const [projectFilter, setProjectsFilter] = useState<{ key: keyof Project, value: string | boolean } | null>(null)
	const [distance, setDistance] = useState(0)
	const [width, setWidth] = useState(70)
	const debouncedSearch = useDebounce(projectSeachState, 450);

	const { data: projects, error, isLoading, refetch } = useGetProjectsQuery({ search: debouncedSearch });


	const filteredProjects = projectFilter === null || projectFilter.value === "" || !projectFilter.value
		? projects
		: projects?.filter(project => {
			if (projectFilter.key === "status" && projectFilter.value === ProjectStatus.FAILED) {
				return project.status === ProjectStatus.FAILED || project.status === ProjectStatus.CANCELED
			}
			return project[projectFilter.key] === projectFilter.value
		});


	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectSearchState(e.target.value)
		// refetch()
	}
	const tabs = [
		{ label: "All Projects", key: "status" as keyof Project, value: "", ref: useRef<HTMLButtonElement>(null) },
		{ label: "Ready", key: "status" as keyof Project, value: ProjectStatus.READY, ref: useRef<HTMLButtonElement>(null) },
		{ label: "Building", key: "status" as keyof Project, value: ProjectStatus.BUILDING, ref: useRef<HTMLButtonElement>(null) },
		{ label: "Failed", key: "status" as keyof Project, value: ProjectStatus.FAILED, ref: useRef<HTMLButtonElement>(null) },
		{ label: "Disabled", key: "isDisabled" as keyof Project, value: true, ref: useRef<HTMLButtonElement>(null) },
	];

	const handleProjectFilterChange = (key: keyof Project, value: any, index: number) => {
		const button = tabs[index].ref.current;
		if (button) {
			const rect = button.getBoundingClientRect();
			const parentRect = button.parentElement?.getBoundingClientRect();
			if (parentRect) {
				setDistance(rect.left - parentRect.left);
				setWidth(rect.width);
			}
		}

		if (value === "") {
			setProjectsFilter(null);
		} else {
			setProjectsFilter({ key, value });
		}
	}

	const isActiveTab = (tabValue: any) => {
		if (!projectFilter && tabValue === "") return true;
		if (projectFilter?.key === "status" && tabValue === ProjectStatus.FAILED) {
			return projectFilter.value === ProjectStatus.FAILED || projectFilter.value === ProjectStatus.CANCELED;
		}
		return projectFilter?.value === tabValue;
	}
	if ((!projects || projects.length === 0) && !projectSeachState && !debouncedSearch && !isLoading) {
		return <ProjectEmptyState />
	}
	return (
		<div>
			<div className="min-h-screen">
				<header className="border-b ">
					<div className="max-w-7xl mx-auto px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-8">
								<nav className="flex gap-6 duration-300 relative">
									{tabs.map((tab, index) => (
										<button
											key={tab.label}
											ref={tab.ref}
											onClick={() => handleProjectFilterChange(tab.key, tab.value, index)}
											className={`text-sm pb-1 transition-colors ${isActiveTab(tab.value) ? "text-primary" : "text-gray-500"
												}`}
										>
											{tab.label}
										</button>
									))}
									<div
										className="bg-primary h-0.5 absolute -bottom-1 transition-all duration-300 ease-out"
										style={{
											transform: `translateX(${distance}px)`,
											width: `${width}px`,
											opacity: projectFilter || projectFilter === null ? 1 : 0
										}}
									/>
								</nav>
							</div>
							<button onClick={() => router.push("/new")} className="px-4 py-2 rounded-md bg-blue-600 text-sm border border-blue-900 font-medium flex items-center gap-2 ">
								<FaPlus size={16} />
								Add New
							</button>
						</div>
					</div>
				</header>

				<main className="max-w-7xl mx-auto px-6 py-8">
					<div className="flex items-center gap-4 mb-8">
						<div className="flex-1 relative">
							<CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
							<Input
								type="text"
								placeholder="Search projects..."
								value={projectSeachState}
								onChange={handleSearch}
								className="w-full  border dark:bg-neutral-900 bg-white rounded-md pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
							/>
						</div>
					</div>


					{isLoading ? (
						<div>
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.3, ease: "easeInOut" }}
								className="flex gap-6 items-center justify-center">
								<p className="text-gray-500">Loading...</p>
								<AiOutlineLoading3Quarters className="animate-spin " />
							</motion.div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
							{filteredProjects && filteredProjects.map((project) => (
								<div onClick={() => router.push("/projects/" + project._id)}
									key={project._id}
									className={cn("dark:bg-zinc-900 bg-[#fdfdfd] border dark:border-gray-800 border-gray-300 shadow-gray-200 shadow dark:shadow-none  rounded-md p-5 hover:border-blue-500 dark:hover:border-blue-900 transition-all duration-200 group cursor-pointer leading-5", project.isDisabled && "dark:hover:border-red-300 hover:border-red-300")}
								>
									<div className="flex items-start justify-between mb-4">

										<div className="flex-1">
											<h3 className="text-lg text-primary  font-semibold mb-1 transition-colors">
												{project.name}
											</h3>
											<div className="flex items-center gap-2 text-sm ">
												<IoMdGlobe size={18} className='text-less' />
												<span className="hover:underline text-less">{project.subdomain}</span>
											</div>
										</div>
										{project.isDisabled && <div className='text-xs border mt-1 px-2 py-1 rounded-md text-red-400'>
											Disabled
										</div>
										}
										<button className="p-2 dark:hover:bg-zinc-800 hover:bg-zinc-300 rounded-md transition-colors opacity-0 group-hover:opacity-100">
											<FiMoreHorizontal size={18} className="" />
										</button>
									</div>

									<div className="flex items-center gap-4 text-sm text-less mb-4">
										<div className="flex items-center gap-1.5">
											<IoMdGitBranch size={14} />
											<span>{project.branch}</span>
										</div>
										<div className="flex items-center gap-1.5">
											<CiClock1 size={14} />
											<span>{new Date(project.lastDeployedAt || "").toDateString()}</span>
										</div>
									</div>

									<div className="flex items-center justify-between pt-4 border-t text-less border-gray-800">
										<div className="flex items-center gap-2">
											<div className={`w-2 h-2 rounded-full ${getStatusBg(project.status)[0]}`}></div>
											<span className="text-sm ">{project.status}</span>
										</div>
										<span className="text-xs border rounded-full  px-2.5 py-1  text-some-less">
											{project.techStack}
										</span>
									</div>
								</div>
							))}
						</div>
					)}

					{projects && projects.length === 0 && (
						<div className="text-center py-16">
							<p className="text-gray-400 mb-2">No projects found</p>
							<p className="text-sm text-gray-500">Try adjusting your search query</p>
						</div>
					)}
				</main>
			</div>


		</div>
	);
}
