

import { lazy, Suspense, } from "react"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"

const BandwidthChart = lazy(() => import("@/components/analytics/Bandwidth"));
const OverviewChart = lazy(() => import("@/components/analytics/Overview"));
const TopPages = lazy(() => import("@/components/analytics/TopPages"));
const OsStats = lazy(() => import("@/components/analytics/OsStats"));

const ProjectAnalytics = ({ projectId }: { projectId: string }) => {


	return (
		<div>
			<Accordion type="multiple" defaultValue={["overview"]}>
				<AccordionItem value="overview" >
					<AccordionTrigger className="hover:no-underline text-xl">Traffic Overview</AccordionTrigger>
					<AccordionContent>
						<Suspense fallback={<div className="flex h-[400px] items-center justify-center">Loading...</div>}>
							<OverviewChart projectId={projectId} />
						</Suspense>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="bandwidth">
					<AccordionTrigger className="hover:no-underline text-xl">Bandwidth</AccordionTrigger>
					<AccordionContent>
						<Suspense fallback={<div className="flex h-[400px] items-center justify-center">Loading...</div>}>
							<BandwidthChart projectId={projectId} />
						</Suspense>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="pages">
					<AccordionTrigger className="hover:no-underline text-xl">Top Pages</AccordionTrigger>
					<AccordionContent>
						<Suspense fallback={<div className="flex h-[400px] items-center justify-center">Loading...</div>}>
							<TopPages projectId={projectId} />
						</Suspense>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="os">
					<AccordionTrigger className="hover:no-underline text-xl">Os Stats</AccordionTrigger>
					<AccordionContent>
						<Suspense fallback={<div className="flex h-[400px] items-center justify-center">Loading...</div>}>
							<OsStats projectId={projectId} />
						</Suspense>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

		</div>
	)
}
export default ProjectAnalytics