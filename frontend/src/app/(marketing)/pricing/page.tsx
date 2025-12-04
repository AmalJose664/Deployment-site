
import Navbar from "@/components/Navbar"
import PlanBox from "./PlanBox";
import BackButton from "@/components/BackButton"
const page = () => {
	return (
		<PricingPage />
	)
}
export default page

function PricingPage() {
	return (
		<>
			<div className="sticky top-0 z-10 bg-background dark:border-zinc-800 border-gray-200">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
					<BackButton />
				</div>
			</div>
			<div className="flex justify-center flex-col items-center w-full h-full pb-20">
				<div className="text-center mx-auto py-16 h-[300px] border-y w-full dark:bg-zinc-900/50 bg-zinc-200/50  mb-20 mr-auto">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Ship Fast.
					</h1>

					<h2 className="text-xl md:text-2xl font-medium mb-4">
						Scale Faster.
					</h2>

					<p className="text-sm md:text-base text-neutral-400">
						Built for developers who move quickly. Simple pricing that grows with your velocity.
					</p>
				</div>
				<div className="flex items-center justify-center flex-col gap-4">
					<div className="flex items-center flex-col justify-center">
						<h2> Pricing</h2>
						<p>Plans that grow with you</p>
					</div>
					<PlanBox />
				</div>
			</div>
		</>
	);
}