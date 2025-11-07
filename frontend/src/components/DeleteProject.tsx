
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRef, useState } from "react"
import { useDeleteProjectMutation } from "@/store/services/projectsApi"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export function DeleteProjectDialog({ projectName, projectId }: { projectName: string, projectId: string }) {
	const [confirmText, setConfirmText] = useState("")
	const [deleteProject, data] = useDeleteProjectMutation()
	const ref = useRef<HTMLButtonElement>(null)
	const router = useRouter()
	const handleDelete = async () => {
		if (confirmText === projectName) {
			try {
				const result = await deleteProject(projectId).unwrap()
				console.log("Deleted:", result)
				toast.success(`Project ${projectName} has been deleted.`)
				router.push("/projects")
			} catch (err) {
				console.error("Delete failed:", err)
				toast.error("Failed to delete project")
				ref.current?.click()
			}

		} else {
			alert("Project name does not match.")
		}
	}

	return (
		<Dialog >
			<DialogTrigger asChild>
				<Button className="text-red-500 border border-red-400 text-sm px-3 py-1 rounded-md bg-background hover:bg-red-50 dark:hover:bg-[#1a1a1a]" size="sm">
					Delete Project
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Delete Project</DialogTitle>
					<DialogDescription>
						This action cannot be undone. To confirm, type the project name below:
						<br />
						{projectName}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Input
						placeholder={`Type "${projectName}"`}
						value={confirmText}
						onChange={(e) => setConfirmText(e.target.value)}
						className="font-mono"
					/>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button ref={ref} variant="outline">Cancel</Button>
					</DialogClose>

					<Button
						className="text-red-500 border border-red-400 text-sm px-3 py-1 rounded-md bg-background hover:bg-red-50 dark:hover:bg-[#1a1a1a] min-w-20"
						disabled={confirmText !== projectName || data.isLoading}
						onClick={handleDelete}
					>
						{data.isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}