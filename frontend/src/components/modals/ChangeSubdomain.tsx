
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
import { useEffect, useRef, useState } from "react"
import { useChangeProjectSubdomainMutation } from "@/store/services/projectsApi"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDebounce } from "@/hooks/useDebounce"
import axiosInstance from "@/lib/axios"
import { cn } from "@/lib/utils"
import { IoClose } from "react-icons/io5"
import { IoMdCheckmark } from "react-icons/io"

export function ChangeProjectSubdomainDialog({ projectName, projectId }: { projectName: string, projectId: string }) {
	const [confirmText, setConfirmText] = useState("")
	const [subdomain, setSubdomain] = useState("")
	const [available, setAvailable] = useState(true)
	const [loading, setLoading] = useState(false)
	const debouncedValue = useDebounce(subdomain, 750);
	const [changeProject, data] = useChangeProjectSubdomainMutation()
	const ref = useRef<HTMLButtonElement>(null)
	const router = useRouter()
	useEffect(() => {
		const checkFn = async () => {
			try {
				if (!debouncedValue) return
				setLoading(true)
				const response = await axiosInstance.get("/projects/subdomain/check?value=" + subdomain)
				setAvailable(response.data.available)
			} catch (error) {
				console.log(error)
				setAvailable(false)
			} finally {
				setLoading(false)
			}
		}
		checkFn()
	}, [debouncedValue])
	const handleUpdate = async () => {
		if (!available) {
			return toast.error("Slug not available")
		}
		if (confirmText === projectName) {
			try {
				const result = await changeProject({ projectId, newSubdomain: debouncedValue }).unwrap()
				console.log("Update:", result)
				toast.success(`Project ${projectName} has been updated.`)
				router.push("/projects")
			} catch (err: any) {
				if (err.status !== 400) console.error("Update failed:", err)
				toast.error("Failed to Update project")
				ref.current?.click()
			}

		} else {
			toast.error("Project name does not match.")
		}
	}
	const toggleLoading = debouncedValue !== subdomain
	return (
		<Dialog >
			<DialogTrigger asChild>
				<Button variant={"outline"} className="text-primary  text-sm px-3 py-1 rounded-md" size="sm">
					Update
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Update Project</DialogTitle>
					<DialogDescription>
						To confirm, type the project name and new subdomain slug below:
						<br />
						{projectName}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4 space-y-4">
					<div >
						<label htmlFor="">
							Name
						</label>
						<Input
							placeholder={`Type "${projectName}"`}
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
							className="font-mono mt-2"
						/>
					</div>
					<div >
						<label htmlFor="">
							Slug
						</label>
						<div className="relative">
							<Input
								placeholder="Type a word..."
								value={subdomain}
								onChange={(e) => setSubdomain(e.target.value)}
								className="font-mono mt-2"
							/>
							{(loading || toggleLoading) && <AiOutlineLoading3Quarters
								className={cn((loading || toggleLoading) && "animate-spin duration-200",
									"absolute right-2 bottom-2")} />
							}
							{available
								? ((debouncedValue && !toggleLoading) ? <IoMdCheckmark className="text-green-400 size-6 absolute right-2 bottom-1" /> : "")
								: (!toggleLoading ? <IoClose className="text-red-500 size-6 absolute right-2 bottom-1" /> : "")

							}
						</div>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button ref={ref} variant="outline">Cancel</Button>
					</DialogClose>

					<Button variant={"outline"}
						className="text-primary border text-sm px-3 py-1 rounded-md bg-background hover:bg-red-50 dark:hover:bg-[#1a1a1a] min-w-20"
						disabled={confirmText !== projectName || data.isLoading}
						onClick={handleUpdate}
					>
						{data.isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Update"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}