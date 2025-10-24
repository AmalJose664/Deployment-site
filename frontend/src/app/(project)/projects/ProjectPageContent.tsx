"use client"
import { InputBox } from '@/components/ui/InputBox';
import { CiClock1, CiSearch } from "react-icons/ci";
import { IoMdGlobe, IoMdGitBranch } from "react-icons/io";
import { FaChevronDown, FaPlus } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { useState } from 'react';
import { useGetProjectsQuery } from '@/store/services/projectsApi';
import { useDebounce } from '@/hooks/useDebounce';
import ProjectEmptyState from './ProjectEmptyState';
import { ProjectStatus } from '@/types/Project';
import { useRouter } from "next/navigation"


export default function ProjectContent() {

	const router = useRouter()
	const [projectSeachState, setProjectSearchState] = useState("")
	const [projectFilter, setProjectsFilter] = useState("")
	const [distance, setDistance] = useState(-1)
	const debouncedSearch = useDebounce(projectSeachState, 450);

	const { data: projects, error, isLoading, refetch } = useGetProjectsQuery({ search: debouncedSearch });

	if ((!projects || projects.length === 0) && !projectSeachState && !debouncedSearch) {
		return <ProjectEmptyState />
	}
	const filteredProjects = projectFilter === ''
		? projects
		: projects?.filter(project => {
			if (projectFilter === ProjectStatus.FAILED) {
				return project.status === ProjectStatus.FAILED || project.status === ProjectStatus.CANCELED
			}
			return project.status === projectFilter
		});
	if (isLoading) return <p>Loading...</p>;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'READY':
				return 'bg-emerald-500';
			case 'BUILDING':
				return 'bg-amber-500';
			case 'FAILED':
				return 'bg-red-500';
			case 'CANCELLED':
				return 'bg-red-500';
			default:
				return 'bg-gray-500';
		}
	};
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectSearchState(e.target.value)
		// refetch()
	}
	const handleProjectFilterChange = (status: string) => {
		const distanceMatcher = {
			[String(ProjectStatus.READY)]: 80,
			[String(ProjectStatus.BUILDING)]: 145,
			[String(ProjectStatus.FAILED)]: 214,
			[String(ProjectStatus.CANCELED)]: 60,
		}

		if (status !== projectFilter) {
			setDistance(distanceMatcher[status] || -1)
			setProjectsFilter(status)
		}
	}
	console.log("re render.....", distance)
	return (
		<div>
			<div className="min-h-screen">
				<header className="border-b border-gray-800">
					<div className="max-w-7xl mx-auto px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-8">
								<nav className="flex gap-6 duration-300 relative">
									<button onClick={() => handleProjectFilterChange('')} className={"text-sm pb-1 border-less" + " " + `${!projectFilter && "border-b-2"}`}>
										All Projects
									</button>
									<button onClick={() => handleProjectFilterChange(ProjectStatus.READY)} className={"text-sm pb-1 border-less" + " " + `${projectFilter === ProjectStatus.READY && "border-b-2"}`}>
										Ready
									</button>
									<button onClick={() => handleProjectFilterChange(ProjectStatus.BUILDING)} className={"text-sm pb-1 border-less" + " " + `${projectFilter === ProjectStatus.BUILDING && "border-b-2"}`}>
										Building
									</button>
									<button onClick={() => handleProjectFilterChange(ProjectStatus.FAILED)} className={"text-sm pb-1 border-less" + " " + `${(projectFilter === ProjectStatus.FAILED || projectFilter === ProjectStatus.CANCELED) && "border-b-2"}`}>
										Failed
									</button>
									<button className={"text-sm pb-1"}>
										Favorites
									</button>
									<div className={"bg-some-less w-18 h-1 absolute -bottom-1 duration-200"} style={{ transform: `translateX(${distance || 10}px)` }}>

									</div>
								</nav>
							</div>
							<button onClick={() => router.push("/new")} className="px-4 py-2 rounded-lg bg-blue-600 text-sm border border-blue-900 font-medium flex items-center gap-2 ">
								<FaPlus size={16} />
								Add New
							</button>
						</div>
					</div>
				</header>


				<main className="max-w-7xl mx-auto px-6 py-8">
					{/* Search and Filter Bar */}
					<div className="flex items-center gap-4 mb-8">
						<div className="flex-1 relative">
							<CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
							<InputBox
								type="text"
								placeholder="Search projects..."
								value={projectSeachState}
								onChange={handleSearch}
								className="w-full  border dark:border-gray-800 border-gray-300 dark:bg-inherit bg-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
							/>
						</div>
					</div>


					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
						{filteredProjects && filteredProjects.map((project) => (
							<div
								key={project._id}
								className="dark:bg-zinc-900 bg-[#fdfdfd] border dark:border-gray-800 border-gray-300  shadow-gray-200 shadow dark:shadow-none  rounded-xl p-5 hover:border-blue-500 dark:hover:border-blue-900 transition-all duration-200 group cursor-pointer leading-5 "
							>
								<div className="flex items-start justify-between mb-4">
									<div className="flex-1">
										<h3 className="text-lg text-primary  font-semibold mb-1 hover:underline transition-colors">
											{project.name}
										</h3>
										<div className="flex items-center gap-2 text-sm ">
											<IoMdGlobe size={18} className='text-less' />
											<span className="hover:underline text-less">{project.subdomain}</span>
										</div>
									</div>
									<button className="p-2 dark:hover:bg-zinc-800 hover:bg-zinc-300 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
										<FiMoreHorizontal size={18} className="" />
									</button>
								</div>

								{/* Project Info */}
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

								{/* Status and Framework */}
								<div className="flex items-center justify-between pt-4 border-t text-less border-gray-800">
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
										<span className="text-sm ">{project.status}</span>
									</div>
									<span className="text-xs border rounded-full  px-2.5 py-1  text-some-less">
										{project.isDeleted}
									</span>
								</div>
							</div>
						))}
					</div>

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
