
"use client"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { FiMoreHorizontal } from "react-icons/fi"

interface OptionsComponentProps {
	parentClassName?: string,
	options: {
		title: string,
		Svg?: React.ComponentType,
		className: string,
		actionFn: () => void
		isDisabled?: boolean
	}[]
}
const OptionsComponent = ({ options, parentClassName }: OptionsComponentProps) => {
	return (
		<div className="mr-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors border">
						<FiMoreHorizontal size={20} />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={cn("mr-6", parentClassName)} align="start">
					<DropdownMenuGroup className="space-y-1">
						{options.map(({ Svg, ...opt }, index) => (
							<DropdownMenuItem disabled={opt.isDisabled} key={index} className={cn(opt.className, "cursor-pointer")} onClick={opt.actionFn}>
								{opt.title}
								{Svg && <Svg />}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
export default OptionsComponent