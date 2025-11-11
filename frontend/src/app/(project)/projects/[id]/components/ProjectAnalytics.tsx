"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "An interactive bar chart"

const chartData = [
	{
		date: '2025-11-10',
		request_mb: 0.005433082580566406,
		response_mb: 2.1122970581054688,
		total_mb: 2.117730140686035
	},
	{
		date: '2025-11-11',
		request_mb: 0.024164199829101562,
		response_mb: 10.4124755859375,
		total_mb: 10.436639785766602
	}

]

const chartConfig = {
	views: {
		label: "Page Views",
	},
	request_mb: {
		label: "Desktop",
		color: "var(--chart-2)",
	},
	response_mb: {
		label: "Mobile",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig

export function ChartBarInteractive() {
	const [activeChart, setActiveChart] =
		React.useState<keyof typeof chartConfig>("request_mb")

	const total = React.useMemo(
		() => ({
			request_mb: chartData.reduce((acc, curr) => acc + curr.request_mb || 0, 0),
			response_mb: chartData.reduce((acc, curr) => acc + curr.response_mb || 0, 0),
		}),
		[]
	)

	return (
		<Card className="py-0">
			<CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
					<CardTitle>Bar Chart - Interactive</CardTitle>
					<CardDescription>
						Showing total visitors for the last 3 months
					</CardDescription>
				</div>
				<div className="flex">
					{["request_mb", "response_mb"].map((key) => {
						const chart = key as keyof typeof chartConfig
						return (
							<button
								key={chart}
								data-active={activeChart === chart}
								className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
								onClick={() => setActiveChart(chart)}
							>
								<span className="text-muted-foreground text-xs">
									{chartConfig[chart].label}
								</span>
								<span className="text-lg leading-none font-bold sm:text-3xl">
									{total[key as keyof typeof total].toLocaleString()}
								</span>
							</button>
						)
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<BarChart
						accessibilityLayer
						data={chartData}
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
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="views"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})
									}}
								/>
							}
						/>
						<Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

const ProjectAnalytics = () => {
	return (
		<div>
			<ChartBarInteractive />
		</div>
	)
}
export default ProjectAnalytics