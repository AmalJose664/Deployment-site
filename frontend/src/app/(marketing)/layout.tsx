import Navbar from "@/components/Navbar"

export default function BillingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <div>
		<Navbar className="" />
		{children}
	</div>
}