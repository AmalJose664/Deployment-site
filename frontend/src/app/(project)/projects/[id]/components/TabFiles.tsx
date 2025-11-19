
import FilesComponent from "@/components/FilesComponent";

interface TabFilesProps {
	projectId: string
	deploymentId?: string
}




const TabFiles = ({ projectId, deploymentId }: TabFilesProps) => {

	return (
		<div className="border rounded-md px-4 py-6 dark:bg-[#111111] bg-white">
			<FilesComponent projectId={projectId} deploymentId={deploymentId} >
				<h2 className="text-xl font-semibold mb-1">Build Output Files</h2>
			</FilesComponent>
		</div>
	)
}


export default TabFiles