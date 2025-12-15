import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { HiMiniArrowUpRight } from "react-icons/hi2"
import { LuFolderCode } from "react-icons/lu"

interface NoDeploymentProps {
	buttonAction: () => void
	titleText: string
	descriptionText: string
	buttonText: string
	learnMoreUrl: string
	buttonIcon: React.ReactNode
}

const NoDeployment = ({ buttonAction, buttonText, descriptionText, learnMoreUrl, titleText, buttonIcon }: NoDeploymentProps) => {

	return (
		<div className="border rounded-md  flex items-center justify-center mb-4">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="default">
						<LuFolderCode />
					</EmptyMedia>
					<EmptyTitle className="text-primary">{titleText}</EmptyTitle>
					<EmptyDescription>
						{descriptionText}
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex gap-2">
						<Button onClick={buttonAction}>{buttonText} {buttonIcon} </Button>
					</div>
				</EmptyContent>
				<Button
					variant="link"
					asChild
					className="text-muted-foreground"
					size="sm"
				>
					<a href={learnMoreUrl}>
						Learn More <HiMiniArrowUpRight />
					</a>
				</Button>
			</Empty>
		</div>
	)
}
export default NoDeployment