import { Button } from "@/components/ui/button"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty"
import { LuFolderCode } from "react-icons/lu";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import Link from "next/link";
const ProjectEmptyState = () => {
	return (
		<div className="mt-6 flex items-center justify-center">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="default">
						<LuFolderCode />
					</EmptyMedia>
					<EmptyTitle className="text-primary">No Projects Yet</EmptyTitle>
					<EmptyDescription>
						You haven&apos;t created any projects yet. Get started by creating
						your first project.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex gap-2">
						<Link href={'/new'} className=""><Button>Create Project</Button></Link>
						<Button variant="outline">Import Project</Button>
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
export default ProjectEmptyState