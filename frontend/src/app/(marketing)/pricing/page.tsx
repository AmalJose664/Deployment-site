
import Navbar from "@/components/Navbar"
import PlanBox from "./PlanBox";
import BackButton from "@/components/BackButton"
const page = () => {
	return (
		<div>
			<Navbar className="" />
			<PricingPage />
		</div>
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
			<div className="flex justify-center items-center">

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