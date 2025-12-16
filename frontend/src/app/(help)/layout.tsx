import { Footer } from "@/components/GlobalFooter"
import Navbar from "@/components/Navbar"

export default function HelpLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div>
		<Navbar className="" showOtherLinks />
		{children}
		<Footer />
	</div>
}