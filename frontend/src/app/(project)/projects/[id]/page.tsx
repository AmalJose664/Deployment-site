import Navbar from "@/components/Navbar"
import { ProjectPageContainer } from "./ProjectPageContainer"

export default async function Page({
	params,
}: {
	params: { id: string }
}) {
	const { id } = await params
	return (
		<div className="min-h-screen flex flex-col">

			<Navbar />
			<main className="flex-1">
				<ProjectPageContainer projectId={id as string} />
			</main>
		</div>
	)
}