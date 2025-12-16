import { cn, getStatusBg } from "@/lib/utils";
import { Fragment } from "react"
export const SubtleProgressBar = ({ percentage, color = "bg-neutral-900 dark:bg-white" }: { percentage: number, color?: string }) => (
	<div className="w-full bg-neutral-100 dark:bg-neutral-800 h-0.5 rounded-full mt-2 overflow-hidden relative">
		<div className={`h-full absolute top-0 left-0 ${color}`} style={{ width: `${percentage}%` }} />
	</div>
);
export const ThinSparkline = ({ data }: { data: number[] }) => {
	const max = Math.max(...data);
	const min = Math.min(...data);
	// Calculate points for a 60x16 SVG
	const points = data.map((d, i) => {
		const x = (i / (data.length - 1)) * 60;
		const y = 16 - ((d - min) / (max - min)) * 16;
		return `${x},${y}`;
	}).join(" ");
	return (
		<svg width="60" height="16" viewBox="0 0 60 16" className="overflow-visible fill-none stroke-neutral-400/60 dark:stroke-neutral-600 stroke-1">
			<polyline points={points} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};
export const StatusHistory = ({ statuses }: { statuses: string[] }) => {
	const reversed = statuses.toReversed()
	return (
		<div className="flex w-full items-center gap-0">
			{reversed.map((st, i) => (
				<Fragment key={i}>
					<div className={cn("size-2 rounded-full shrink-0", getStatusBg(st.toUpperCase())[0])}>
					</div>
					{reversed[i + 1] && (
						<div className="h-[2px] bg-less" style={{ width: `${inverseScale(statuses.length)}px` }}>
						</div>
					)}
				</Fragment>
			))}
		</div>
	)
}
function inverseScale(len: number, minLen = 1, maxLen = 20) {
	const min = 8
	const max = 300

	return Math.round(
		max - ((len - minLen) * (max - min)) / (maxLen - minLen)
	)
}