import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { getStatusBg } from "@/lib/moreUtils/combined"
import { Dispatch, SetStateAction } from "react"
import { IoIosArrowDown } from "react-icons/io"
interface DeploymentStatusButtonsProps {
	statuses: Record<string, boolean>
	setStatuses: Dispatch<SetStateAction<Record<string, boolean>>>
}

const DeploymentStatusButtons = ({ statuses, setStatuses }: DeploymentStatusButtonsProps) => {
	return (
		<Popover>
			<PopoverTrigger className="border flex gap-2 mb-4 items-center py-1 px-2 rounded-md whitespace-nowrap">
				<span className="text-sm text-primary">Status {Object.values(statuses).filter(Boolean).length} / 6 </span><IoIosArrowDown />
			</PopoverTrigger>
			<PopoverContent className="max-w-60">
				<div>
					{Object.keys(statuses).map((st) => (
						<div key={st} className="flex gap-8 items-center hover:border-neutral-300 dark:hover:border-neutral-700 rounded-md border border-transparent pl-4">
							<input
								type="checkbox" className="border-none ring-0" checked={statuses[st]}
								onChange={() => setStatuses({ ...statuses, [st]: !statuses[st] })} />
							<div className={getStatusBg(st)[0] + " w-4 h-4 rounded-full border"} />
							<label htmlFor="">{st.slice(0, 1).toUpperCase() + st.slice(1, 20).toLowerCase()}</label>
						</div>
					)
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
export default DeploymentStatusButtons