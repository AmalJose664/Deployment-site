import Navbar from "@/components/Navbar"

export default function HelpLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div>
		<Navbar className="" showOtherLinks />
		{children}
	</div>
}