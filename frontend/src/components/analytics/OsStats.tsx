"use client"

import { Pie, PieChart, LabelList } from "recharts"
import {
	Card,
	CardContent,
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
import { useGetOsStatsQuery } from "@/store/services/analyticsApi"
import { useState } from "react"
import { BLUE_COLORS } from "@/lib/moreUtils/combined"

const chartConfig = {
} satisfies ChartConfig

function OsList({ projectId }: { projectId: string }) {
	const [interval, setInterval] = useState("7d")
	const { data: osStatsData, isLoading, error } = useGetOsStatsQuery({
		projectId,
		interval,
	})
	const chartData =
		osStatsData?.map((item: any, index) => ({
			...item,
			fill: BLUE_COLORS[index % BLUE_COLORS.length],
		})) || []
	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex h-[400px] items-center justify-center">
					<p className="text-muted-foreground">Loading data...</p>
				</CardContent>
			</Card>
		)
	}
	if (error) {
		return (
			<Card className="dark:bg-background">
				<CardContent className="flex h-[400px] items-center justify-center">
					<p className="text-destructive">
						{(error as any)?.message || (error as { data?: { message?: string } })?.data?.message}
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="dark:bg-background flex flex-col w-[300px]">
			<CardHeader className="items-center pb-4">
				<CardTitle>OS Stats</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<Select value={interval} onValueChange={setInterval}>
					<SelectTrigger className="w-[120px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="dark:bg-background">
						<SelectItem value="1h">Last Hour</SelectItem>
						<SelectItem value="1d">Last 24h</SelectItem>
						<SelectItem value="7d">Last 7d</SelectItem>
						<SelectItem value="1mo">Last 30d</SelectItem>
					</SelectContent>
				</Select>
				{chartData.length !== 0 && chartData ? (<ChartContainer
					config={chartConfig}
					className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							content={<ChartTooltipContent
								className="dark:border-zinc-700 border-zinc-300"
								hideLabel
								formatter={(value, name, props) => (
									<div className="flex flex-col gap-1">
										<div className="text-xs font-medium">{Number(value).toFixed(2)}%</div>
										<div className="flex items-center gap-2">
											<span className="font-bold"> {props.payload.users}</span>
											<span className="text-muted-foreground">Requests</span>
										</div>
									</div>
								)}
							/>}
						/>
						<Pie
							data={chartData}
							dataKey="percentage"
							nameKey="uaOs"
							innerRadius={40}
							outerRadius={100}
						>
							<LabelList
								dataKey="uaOs"
								className="fill-background"
								stroke=""
								fontSize={12}
							/>

						</Pie>
					</PieChart>
				</ChartContainer>) : (
					<div className="flex h-[250px] items-center justify-center">
						<p className="text-muted-foreground">No page data available</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default OsList
