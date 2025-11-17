import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"


const DisableProject = ({ projectId }: { projectId: string }) => {

	const disableProject = () => {

	}
	return (
		<AlertDialog>
			<AlertDialogTrigger className="text-red-500 border border-red-400 text-sm px-3 py-1 rounded-md bg-background hover:bg-red-50 dark:hover:bg-[#1a1a1a]">
				Disable Project
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						Your project will not be accessible until you reset.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel >Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={disableProject} className="border-red-500 border bg-red-400">Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>

	)
}
export default DisableProject