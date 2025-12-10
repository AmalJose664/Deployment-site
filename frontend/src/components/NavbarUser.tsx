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
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LINKS } from "@/config/constants"
import ThemeSwitcher from "./ThemeIcon"
const NavbarUser = () => {
	const { data: user } = useGetUserQuery()
	const [logout] = useLogoutMutation()
	const router = useRouter()
	return (
		<div className="">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="rounded-full size-10 p-0">
						{user?.profileImage ? (

							<img
								src={user.profileImage}
								alt="User Avatar"
								width={24}
								height={24}
								className="rounded-full"
							/>
						) : (
							<div className="user_avtr_alt rounded-full border" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56 mr-6" align="start">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem className="cursor-pointer" onClick={() => router.push(user ? "/user" : "/login")}>
							{user ? "Profile" : "Login"}
						</DropdownMenuItem>
						{!user &&
							<DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/signup")}>
								Signup
							</DropdownMenuItem>
						}
						<DropdownMenuItem className="cursor-pointer" onClick={() => ''}>
							<ThemeSwitcher className="flex items-center gap-2" withText />
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem >
						<Link target="_blank" className="flex gap-2 items-center no-underline" href={LINKS.REPO} >
							GitHub
							<RxExternalLink />
						</Link>
					</DropdownMenuItem>
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



