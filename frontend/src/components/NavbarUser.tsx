"use client"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { useGetUserQuery, useLogoutMutation } from "@/store/services/authApi"
import { RxExternalLink } from "react-icons/rx"
const NavbarUser = () => {
	const { data: user } = useGetUserQuery()
	const [logout] = useLogoutMutation()
	return (
		<div className="">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="rounded-full size-10 p-0"><img
						src={user?.profileImage}
						alt="User Avatar"
						width={24}
						height={24}
						className="rounded-full"
					/></Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56 mr-6" align="start">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem>
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							Billing
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="flex gap-2">
						GitHub
						<RxExternalLink />
					</DropdownMenuItem>
					<DropdownMenuItem>Support</DropdownMenuItem>
					<DropdownMenuItem disabled>API</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => logout()}>
						Log out

					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
export default NavbarUser



