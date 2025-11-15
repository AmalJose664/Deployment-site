import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { HiMiniArrowUpRight } from "react-icons/hi2"
import { IoRocketOutline } from "react-icons/io5"
import { LuFolderCode } from "react-icons/lu"

const NoDeployment = ({ onCreateDeployment }: { onCreateDeployment: () => void }) => {

	return (
		<div className="border rounded-md mt-3 flex items-center justify-center">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="default">
						<LuFolderCode />
					</EmptyMedia>
					<EmptyTitle className="text-primary">No Deployments Yet</EmptyTitle>
					<EmptyDescription>
						You haven&apos;t created any project deployment yet. Run your project by creating your new Deployment.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex gap-2">
						<Button onClick={onCreateDeployment}>Create Deployment <IoRocketOutline /> </Button>
					</div>
				</EmptyContent>
				<Button
					variant="link"
					asChild
					className="text-muted-foreground"
					size="sm"
				>
					<a href="#">
						Learn More <HiMiniArrowUpRight />
					</a>
				</Button>
			</Empty>
		</div>
	)
}
export default NoDeployment