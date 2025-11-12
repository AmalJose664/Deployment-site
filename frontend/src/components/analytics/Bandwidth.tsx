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
import { useGetBandWidthQuery } from "@/store/services/analyticsApi"
import { TiArrowUp, TiArrowDown } from "react-icons/ti";
import { HiMiniArrowsUpDown } from "react-icons/hi2"

const chartConfig = {
	requestMB: {
		label: "Request",
		color: "hsl(var(--chart-1))",
		icon: TiArrowUp,
	},
	responseMB: {
		label: "Response",
		color: "hsl(var(--chart-2))",
		icon: TiArrowDown,
	},
	totalMB: {
		label: "Total",
		color: "hsl(var(--chart-3))",
		icon: HiMiniArrowsUpDown,
	},
} satisfies ChartConfig


export default function BandwidthChart({ projectId }: { projectId: string }) {
	const [range, setRange] = useState("24h")
	const [interval, setInterval] = useState("1h")
	const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("totalMB")

	const { data: bandwidthData, isLoading: loading, error } = useGetBandWidthQuery({ interval, projectId, range })

	const totals = useMemo(
		() => ({
			requestMB: bandwidthData?.reduce((acc, curr) => acc + curr.requestMB, 0),
			responseMB: bandwidthData?.reduce((acc, curr) => acc + curr.responseMB, 0),
			totalMB: bandwidthData?.reduce((acc, curr) => acc + curr.totalMB, 0),
		}),
		[bandwidthData]
	)

	const handleRangeChange = (newRange: string) => {
		setRange(newRange)
		// Auto-adjust interval based on range
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
					<p className="text-muted-foreground">Loading bandwidth data...</p>
				</CardContent>
			</Card>
		)
	}


	if (error) {
		return (
			<Card>
				<CardContent className="flex h-[400px] items-center justify-center">
					<p className="text-destructive">{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message}</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="dark:bg-background pt-0 overflow-hidden">
			<CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
					<CardTitle>Bandwidth Usage</CardTitle>
					<CardDescription>
						Request and response data transfer over time
					</CardDescription>
				</div>
				<div className="flex ">
					{(["requestMB", "responseMB", "totalMB"] as const).map((key) => {
						const Icon = chartConfig[key].icon
						return (
							<button
								key={key}
								data-active={activeChart === key}
								className="data-[active=true]:bg-blue-800/50  relative flex flex-1 flex-col justify-center gap-1 border-t px-4 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6"
								onClick={() => setActiveChart(key)}
							>
								<span className="text-muted-foreground text-xs flex-1">
									{chartConfig[key].label}
								</span>
								<span className="text-sm flex gap-2 leading-none font-bold ">
									{totals[key]?.toFixed(2)} MB <Icon className="size-4" />
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
				{(bandwidthData?.length === 0 || !bandwidthData) ? (<Card className="dark:bg-background">
					<CardContent className="flex h-[400px] items-center justify-center">
						<p className="text-muted-foreground">No data found yet</p>
					</CardContent>
				</Card>) :


					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-[300px] w-full"
					>

						<LineChart
							accessibilityLayer
							data={bandwidthData}
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
								tickFormatter={(value) => value + " mb"}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="w-[180px]"
										labelFormatter={(value) => {
											const date = new Date(value)
											return date.toLocaleString("en-US", {
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})
										}}
									/>
								}
							/>
							<Line
								type="linear"
								stroke="var(--color-blue-400)"
								strokeWidth={2}
								dot={false}
								dataKey={activeChart}
								fill={chartConfig[activeChart].color}
							/>
						</LineChart>
					</ChartContainer>
				}
			</CardContent>
		</Card>
	)
}

