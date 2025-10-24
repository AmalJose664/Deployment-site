const ProjectTabs = () => {
	return (
		<div className="flex items-center gap-4 mb-8">
			<button className="text-sm  pb-2 border-b-2 border-less">
				Current
			</button>
			<button className="text-sm text-less hover:text-white transition-colors pb-2">
				All Deployments
			</button>
			<button className="text-sm text-less hover:text-white transition-colors pb-2">
				Analytics
			</button>
			<button className="text-sm text-less hover:text-white transition-colors pb-2">
				Settings
			</button>
		</div>
	)
}
export default ProjectTabs