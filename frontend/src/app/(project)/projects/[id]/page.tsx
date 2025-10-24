import Navbar from "@/components/Navbar"
import { ProjectContent } from "./ProjectContent"

export default async function Page({
	params,
}: {
	params: { id: string }
}) {
	const { id } = await params
	return <div>
		<Navbar />
		<ProjectContent projectId={id} />
	</div>
}