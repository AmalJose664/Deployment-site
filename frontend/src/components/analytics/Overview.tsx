import { useState, useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useGetOverviewQuery } from "@/store/services/analyticsApi"
import { FiUsers } from "react-icons/fi"
import { TiEye } from "react-icons/ti"
import { MdAccessTime } from "react-icons/md"
import { CiHardDrive } from "react-icons/ci"


const chartConfig = {
	requests: {
		label: "Requests",
		color: "var(--color-blue-400)",
		icon: FiUsers,
	},
	uniqueVisitors: {
		label: "Unique Visitors",
		color: "var(--color-blue-400)",
		icon: TiEye,
	},
	avgResponseTime: {
		label: "Avg Response Time",
		color: "var(--color-blue-400)",
		icon: MdAccessTime,
	},
	totalBandwidthMb: {
		label: "Bandwidth",
		color: "var(--color-blue-400)",
		icon: CiHardDrive,
	},
} satisfies ChartConfig
const unitMap = {
	requests: "",
	uniqueVisitors: "",
	avgResponseTime: "ms",
	totalBandwidthMb: "MB",
}


export default function OverviewChart({ projectId }: { projectId: string }) {
	const [range, setRange] = useState("24h")
	const [interval, setInterval] = useState("1h")
	const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("requests")

	const { data: overviewData, isLoading: loading, error } = useGetOverviewQuery({
		interval,
		projectId,
		range
	})

	const totals = useMemo(
		() => ({
			requests: overviewData?.reduce((acc, curr) => acc + curr.requests, 0) || 0,
			uniqueVisitors: Math.max(...(overviewData?.map((ovrview) => ovrview.uniqueVisitors) || [0])),
			avgResponseTime: overviewData?.length
				? (overviewData.reduce((acc, curr) => acc + curr.avgResponseTime, 0) / overviewData.length)
				: 0,
			totalBandwidthMb: overviewData?.reduce((acc, curr) => acc + curr.totalBandwidthMb, 0) || 0,
		}),
		[overviewData]
	)

	const handleRangeChange = (newRange: string) => {
		setRange(newRange)
		if (newRange === "1h" || newRange === "24h") {
			setInterval("1h")
		} else if (newRange === "7d") {
			setInterval("1d")
		} else {
			setInterval("1d")
		}
	}

	if (loading) {
		return (
			<Card>
				<CardContent className="flex h-[400px] items-center justify-center">
					<p className="text-muted-foreground">Loading overview data...</p>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<Card>
				<CardContent className="flex h-[400px] items-center justify-center">
					<p className="text-destructive">
						{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message}
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="dark:bg-background pt-0 overflow-hidden">
			<CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Analytics Overview</CardTitle>
					<CardDescription>
						Key metrics and performance indicators
					</CardDescription>
				</div>
				<div className="grid grid-cols-2 sm:flex">
					{(["requests", "uniqueVisitors", "avgResponseTime", "totalBandwidthMb"] as const).map((key) => {
						const Icon = chartConfig[key].icon
						const value = key === "avgResponseTime"
							? totals[key].toFixed(2)
							: key === "totalBandwidthMb"
								? totals[key].toFixed(2)
								: totals[key]

						return (
							<button
								key={key}
								data-active={activeChart === key}
								className="dark:data-[active=true]:bg-blue-800/50 data-[active=true]:bg-blue-300 relative flex flex-1 flex-col justify-center gap-1 border-t px-3 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-4 sm:py-4"
								onClick={() => setActiveChart(key)}
							>
								<span className="text-less text-xs flex items-center gap-1.5">
									<Icon className="h-3.5 w-3.5" />
									{chartConfig[key].label}
								</span>
								<span className="text-sm font-bold text-less leading-none sm:text-base">
									{value} {unitMap[key]}
								</span>
							</button>
						)
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<div className="mb-4 flex gap-2">
					<Select value={range} onValueChange={handleRangeChange}>
						<SelectTrigger className="w-[140px]">
							<SelectValue placeholder="Select range" />
						</SelectTrigger>
						<SelectContent className="dark:bg-background">
							<SelectItem value="1h">Last Hour</SelectItem>
							<SelectItem value="24h">Last 24 Hours</SelectItem>
							<SelectItem value="7d">Last 7 Days</SelectItem>
							<SelectItem value="30d">Last 30 Days</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{(overviewData?.length === 0 || !overviewData) ? (
					<Card className="dark:bg-background">
						<CardContent className="flex h-[400px] items-center justify-center">
							<p className="text-muted-foreground">No data found yet</p>
						</CardContent>
					</Card>
				) : (
					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-[300px] w-full"
					>
						<LineChart
							accessibilityLayer
							data={overviewData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									const date = new Date(value)
									if (range === "1h" || range === "24h") {
										return date.toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})
									}
									return date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})
								}}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => {
									if (activeChart === "totalBandwidthMb") {
										return `${value}MB`
									}
									if (activeChart === "avgResponseTime") {
										return `${value}ms`
									}
									return value.toString()
								}}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="w-[200px] dark:border-zinc-700 border-zinc-300"
										labelFormatter={(value) => {
											const date = new Date(value)
											return date.toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})
										}}
										formatter={(value) => {
											return `${Number(value).toFixed(2)} ${unitMap[activeChart]}`
										}}
									/>
								}
							/>
							<Line
								type="linear"
								strokeWidth={2}
								dot={false}
								dataKey={activeChart}
								stroke={chartConfig[activeChart].color}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	)
}