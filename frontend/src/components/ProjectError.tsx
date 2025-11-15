import { MdErrorOutline } from "react-icons/md";
const ProjectError = ({ error }: { error: any }) => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center justify-center text-center max-w-md">
				<div className="text-red-500 text-2xl mb-4"><MdErrorOutline /></div>
				<h2 className="text-xl font-semibold mb-2">Failed to load project</h2>
				<p className="text-less mb-4">
					{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message || "Something went wrong"}
				</p>
				<button
					onClick={() => window.location.reload()}
					className="px-4 py-2 border dark:bg-zinc-900 bg-blue-100 rounded-lg hover:opacity-90"
				>
					Retry
				</button>
			</div>
		</div>
	)
}
export default ProjectError