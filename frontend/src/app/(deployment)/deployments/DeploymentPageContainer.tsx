"use client"
import { useGetDeploymentByIdQuery } from "@/store/services/deploymentApi"

const DeploymentPageContainer = ({ deploymentId }: { deploymentId: string }) => {
	const { data: deployment } = useGetDeploymentByIdQuery({ id: deploymentId, params: {} })
	return (
		<div>
			content
			<pre>
				{JSON.stringify(deployment, null, 2)}
			</pre>
		</div>
	)
}
export default DeploymentPageContainer