"use client"
import { Button } from "@/components/ui/button"
import { IPlanIcons, IPlans, PlanIcons, PLANS } from "@/config/plan"
import { cn } from "@/lib/utils"
import { IoCubeSharp } from "react-icons/io5"
import { useGetDetailedQuery } from "@/store/services/authApi"
import { useRouter } from "next/navigation"
const PlanBox = () => {
	const { data: user } = useGetDetailedQuery()
	const userPlan = PLANS[user?.plan as keyof IPlans] || PLANS.FREE
	const router = useRouter()

	const handleClick = (clickedPlan: string) => {
		console.log(clickedPlan)
		if (clickedPlan === "PRO" && userPlan.name === PLANS.FREE.name) {
			return upgrade()
		}
		return router.push("/projects")


	}
	const upgrade = () => {
		alert("hey upgrading")
	}
	return (
		<div className="flex items-center justify-center gap-6">
			{Object.keys(PLANS).map(((plan: string, i) => {
				const currentPlan = PLANS[plan as keyof IPlans]
				const isFree = plan === "FREE"
				const isUserFreePlan = userPlan.name === "FREE"
				return (
					<div key={i} className={
						cn(
							isFree
								? "bg-gradient-to-br from-zinc-900 to-zinc-700"
								: "bg-gradient-to-br from-amber-900/50 to-yellow-700",
							"p-[1px] rounded-md"
						)
					}>
						<div className={cn(!isFree && "hover:border-yellow-500/70 transition-colors duration-300",
							"border rounded-md bg-zinc-900 px-4 py-5 h-[500px] w-80")}>
							<div className="mb-4 p-x3 flex justify-between items-center">
								<IoCubeSharp size={20} className={cn("rotate-z-180", !isFree && "text-yellow-300")} />
								{userPlan.slug === currentPlan.slug &&
									<span className="border px-2 py-1 rounded-full text-xs">Current</span>
								}
							</div>
							<div className="flex items-center justify-between mb-3">
								<div className="">
									<h3 className="text-xl">{plan}</h3>
									<span>
										{currentPlan.slug}
									</span>
								</div>
								<div className="flex items-end gap-1">
									{currentPlan.pricePerMonth > 0 ?
										<>
											<h2>

												{currentPlan.pricePerMonth + "$"}
											</h2>
											<span className="text-xs">/Month</span>
										</>
										: <>
											<span className="text-xs">Forever</span>
										</>
									}
								</div>
							</div>
							<div className="w-full mb-3">
								<hr />
							</div>
							<div className="w-full mb-3 mt-8">
								<Button variant={"default"} className="w-full" onClick={() => handleClick(plan)}>
									{isFree ? "Get Started" : (isUserFreePlan ? "Buy" : "Explore")}
								</Button>
							</div>
							<div className="my-4 h-[200px] mb-3 mt-12">
								{PlanIcons[plan as keyof IPlanIcons].features.map((f, index) => {
									const Icon = f.Icon;
									return (
										<div className="text-sm mb-3 flex gap-4  items-center" key={`feat:${index}`}>
											<Icon size={18} />
											<span>
												{f.text}
											</span>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				)
			}))}
		</div>
	)
}
export default PlanBox