import Navbar from "@/components/Navbar"

export default function UserLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div>
		<Navbar className="" />
		{children}
	</div>
}