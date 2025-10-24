const ProjectLoading = () => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mx-auto mb-4" />
				<p className="text-less">Loading project...</p>
			</div>
		</div>
	)
}
export default ProjectLoading