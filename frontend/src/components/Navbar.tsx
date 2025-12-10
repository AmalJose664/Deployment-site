import Link from "next/link";
import ThemeSwitcher from "./ThemeIcon";
import { GoBell } from "react-icons/go";
import { cn } from "@/lib/utils";
import { IoIosCube, IoMdCloudDone } from "react-icons/io";
import NavbarUser from "./NavbarUser";
import TitleWithLogo from "./TitleWithLogo";

export default function Navbar({ className, showOtherLinks }: { className: string, showOtherLinks?: boolean }) {

	return (
		<nav className={cn(className, "flex w-full items-center justify-between px-6 py-3 border-b dark:border-gray-800 border-gray-300")}>
			<div className="flex items-center space-x-3">
				<svg
					className="h-4 w-4 text-gray-400 rotate-x-180"
					viewBox="0 0 16 16"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
					/>
				</svg>

				<Link
					href="/"
					className="flex items-center space-x-2 hover:no-underline transition"
				>
					<TitleWithLogo useSvg />
				</Link>
				<svg
					className="h-4 w-4 text-gray-400"
					viewBox="0 0 16 16"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M4.01526 15.3939L4.3107 14.7046L10.3107 0.704556L10.6061 0.0151978L11.9849 0.606077L11.6894 1.29544L5.68942 15.2954L5.39398 15.9848L4.01526 15.3939Z"
					/>
				</svg>
			</div>


			<div className="flex items-center gap-6">

				<ul className="hidden md:flex items-center gap-6 text-sm dark:text-white text-black">
					<li>
						<Link href="/projects" className="hover:text-blue-400 flex gap-2 items-center">
							<IoIosCube />Projects
						</Link>
					</li>
					<li>
						<Link href="/deployments" className="hover:text-blue-400 flex gap-2 items-center">
							<IoMdCloudDone />Deployments
						</Link>
					</li>
					{showOtherLinks &&
						<li>
							<Link href="/pricing" className="hover:text-blue-400">
								Pricing
							</Link>
						</li>
					}
				</ul>
				<button
					aria-label="Notifications"
					className="relative p-2 rounded-full dark:hover:bg-gray-100 hover:bg-gray-400 border-1 dark:border-gray-800 border-gray-500 dark:text-gray-200 text-gray-800 hover:text-gray-200 dark:hover:text-gray-800 duration-200"
				>
					<GoBell className="" />
					{/* <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-500"></span> */}
				</button>
				<ThemeSwitcher className="rounded-full" />

				<NavbarUser />

			</div>
		</nav>
	);
}
