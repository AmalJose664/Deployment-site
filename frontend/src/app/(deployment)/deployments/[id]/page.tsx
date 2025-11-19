import Navbar from "@/components/Navbar"
import DeploymentPageContainer from "./DeploymentPageContainer";

export default async function Page({
	params, searchParams
}: {
	params: { id: string }, searchParams: { [key: string]: string | string[] | undefined };
}) {
	const { id } = await params
	const { tab } = await searchParams
	const filteredTab = ['analytics', 'settings', 'deployments', 'project', "files"].includes((tab as string) || "") ? tab : ""
	return (
		<div className="min-h-screen flex flex-col">

			<Navbar className="" />
			<main className="flex-1">
				<DeploymentPageContainer deploymentId={id} />
			</main>
		</div>
	)
}