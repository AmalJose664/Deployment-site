import { SITE_NAME } from "@/config/constants";

import { BsXCircle } from "react-icons/bs";
import { LuLayoutDashboard, LuServerOff } from "react-icons/lu";
import { MdOutlineCheckCircleOutline } from "react-icons/md";

export const metadata = {
	title: "Product | " + SITE_NAME,
	description:
		"The fastest way to deploy React applications to the global edge. Static hosting, asset storage, and zero configuration.",
};
const page = () => {
	return (
		<main className="min-h-screen bg-background text-primary">
			<section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-3xl text-center">
						<h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-6xl mb-6">
							<span className="text-indigo-600">Frontend</span> Excellence
						</h1>
						<p className="mt-6 text-lg leading-8 text-less">
							Stop managing servers. Start shipping code. We provide a streamlined,
							high-performance environment dedicated exclusively to hosting Frontend
							applications and static assets on a network.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<button className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
								Start Deploying
							</button>
							<button className="text-sm border p-3 rounded-md font-semibold leading-6 text-primary flex items-center gap-1 hover:gap-2 transition-all">
								Read documentation <span aria-hidden="true">→</span>
							</button>
						</div>
					</div>
				</div>

				<div className="absolute top-0 -z-10 h-full w-full bg-background">
					<div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-indigo-50/50 blur-[80px]"></div>
				</div>
			</section>



			<section className="py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

						<div className="rounded-2xl border border-less dark:bg-zinc-900 bg-white p-8 shadow-sm ring-1 ring-less">
							<h3 className="flex items-center text-xl font-bold tracking-tight text-primary">
								<LuLayoutDashboard className="mr-2 h-5 w-5 text-indigo-600" />
								What We Optimize For
							</h3>
							<p className="mt-4 text-sm leading-6 text-some-less">
								We are laser-focused on the presentation layer. Our infrastructure is tuned
								specifically for the files that run in your user's browser.
							</p>
							<ul className="mt-8 space-y-3 text-sm leading-6 text-less">
								<li className="flex gap-x-3">
									<MdOutlineCheckCircleOutline className="h-6 w-5 flex-none text-emerald-500" />
									React, Vue, Svelte, and Angular SPAs
								</li>
								<li className="flex gap-x-3">
									<MdOutlineCheckCircleOutline className="h-6 w-5 flex-none text-emerald-500" />
									Assets (HTML, CSS, JS, Images, Fonts, WASM)
								</li>
								<li className="flex gap-x-3">
									<MdOutlineCheckCircleOutline className="h-6 w-5 flex-none text-emerald-500" />
									Client-side routing handling
								</li>
								<li className="flex gap-x-3">
									<MdOutlineCheckCircleOutline className="h-6 w-5 flex-none text-emerald-500" />
									Object Storage for user-generated media
								</li>
							</ul>
						</div>

						{/* Not Supported Column */}
						<div className="rounded-2xl border dark:bg-zinc-900 bg-white p-8">
							<h3 className="flex items-center text-xl font-bold tracking-tight text-primary">
								<LuServerOff className="mr-2 h-5 w-5 text-some-less" />
								Out of Scope
							</h3>
							<p className="mt-4 text-sm leading-6 text-less">
								By intentionally excluding backend compute, we remove the attack surface
								and complexity associated with server management.
							</p>
							<ul className="mt-8 space-y-3 text-sm leading-6 text-less">
								<li className="flex gap-x-3">
									<BsXCircle className="h-6 w-5 flex-none text-red-300" />
									Server-side Node.js/Python runtimes
								</li>
								<li className="flex gap-x-3">
									<BsXCircle className="h-6 w-5 flex-none text-red-300" />
									Long-running background jobs
								</li>
								<li className="flex gap-x-3">
									<BsXCircle className="h-6 w-5 flex-none text-red-300" />
									Relational Databases (Postgres, MySQL) hosting
								</li>
								<li className="flex gap-x-3">
									<BsXCircle className="h-6 w-5 flex-none text-red-300" />
									Serverless Functions (Lambda/Edge Compute)
								</li>
							</ul>
						</div>

					</div>
				</div>
			</section>
		</main>
	)
}

export default page
