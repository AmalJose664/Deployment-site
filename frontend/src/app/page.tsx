import {
	Terminal,
	Zap,
	Globe,
	Shield,
	Github,
	Command,
	Cpu,
	ArrowRight,
	CheckCircle2,
	Menu,
	X,
	Code2,
	GitBranch,
	Layers
} from 'lucide-react';


export default function Home() {
	return (
		<div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
			<Navbar />
			<Hero />
			<Frameworks />
			<Features />
			<CodeSection />
			<CTA />
			<Footer />
		</div>
	);
}

const Navbar = () => {
	const isOpen = !true

	return (
		<nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-black/50 backdrop-blur-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-lg">O</span>
						</div>
						<span className="text-white font-bold text-xl tracking-tight">Orbit</span>
					</div>

					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-8">
							<a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
							<a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Templates</a>
							<a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
							<a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Docs</a>
						</div>
					</div>

					<div className="hidden md:flex items-center gap-4">
						<button className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Log in</button>
						<button className="bg-white text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-200 transition-colors">
							Start Deploying
						</button>
					</div>

					<div className="-mr-2 flex md:hidden">
						<button className="text-gray-400 hover:text-white p-2">
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isOpen && (
				<div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Features</a>
						<a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Templates</a>
						<a href="#" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
						<button className="w-full mt-4 bg-white text-black px-4 py-2 rounded-md text-sm font-bold">
							Start Deploying
						</button>
					</div>
				</div>
			)}
		</nav>
	);
};

const Hero = () => {
	return (
		<div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
			{/* Background Gradients */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent blur-3xl -z-10" />
			<div className="absolute top-20 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-8 animate-fade-in-up">
					<span className="relative flex h-2 w-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
					</span>
					Orbit 2.0 is now live
				</div>

				<h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
					Develop. Preview. <br />
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
						Ship at warp speed.
					</span>
				</h1>

				<p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
					The frontend cloud for React, Vue, and Svelte.
					Instant deployments, automatic scaling, and edge networking built for the modern web.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
					<button className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-transform active:scale-95 flex items-center justify-center gap-2">
						<Github size={20} />
						Import from GitHub
					</button>
					<button className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
						Read Documentation
					</button>
				</div>

				{/* Mock Terminal/Dashboard */}
				<div className="relative max-w-4xl mx-auto rounded-xl border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl shadow-purple-900/20 overflow-hidden">
					<div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
						<div className="ml-4 text-xs text-gray-500 font-mono flex items-center gap-2">
							<Command size={12} /> orbit-cli — deploy
						</div>
					</div>
					<div className="p-6 text-left font-mono text-sm sm:text-base">
						<div className="space-y-2">
							<div className="flex gap-2">
								<span className="text-green-400">➜</span>
								<span className="text-blue-400">~</span>
								<span className="text-gray-300">npx orbit deploy</span>
							</div>
							<div className="text-gray-500">Initialized empty Git repository in .git/</div>
							<div className="text-gray-300">
								<span className="text-purple-400">✔</span> Building project...
							</div>
							<div className="text-gray-300">
								<span className="text-purple-400">✔</span> Optimizing assets...
							</div>
							<div className="text-gray-300">
								<span className="text-purple-400">✔</span> Uploading to Edge Network...
							</div>
							<div className="mt-4 p-3 bg-white/5 border border-white/10 rounded border-l-4 border-l-green-500">
								<div className="text-green-400 font-bold mb-1">Deployment Complete! 🚀</div>
								<div className="text-gray-400">
									Preview: <a href="#" className="text-blue-400 hover:underline">https://orbit-app-xi82.orbit.app</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const FeatureCard = ({ icon: Icon, title, description, className = "" }: any) => (
	<div className={`p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group ${className}`}>
		<div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
			<Icon className="text-purple-400" size={24} />
		</div>
		<h3 className="text-xl font-bold text-white mb-2">{title}</h3>
		<p className="text-gray-400 leading-relaxed">{description}</p>
	</div>
);

const Features = () => {
	return (
		<section className="py-24 bg-black relative">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
						Everything you need to <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
							scale your frontend
						</span>
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						Focus on writing code. We handle the infrastructure, CI/CD, and global distribution.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Bento Grid Layout */}
					<FeatureCard
						icon={Globe}
						title="Global Edge Network"
						description="Your content is cached and served from 100+ regions worldwide, ensuring low latency for every user."
						className="md:col-span-2 bg-gradient-to-br from-white/5 to-purple-900/10"
					/>
					<FeatureCard
						icon={GitBranch}
						title="Git Push to Deploy"
						description="Connect your repo. Every push triggers a deployment. Every branch gets a preview URL."
					/>
					<FeatureCard
						icon={Layers}
						title="Framework Agnostic"
						description="Zero-config support for Next.js, Vue, Svelte, Remix, and static sites."
					/>
					<FeatureCard
						icon={Shield}
						title="DDoS Protection"
						description="Enterprise-grade security baked in. SSL is automatic and free forever."
						className="md:col-span-2"
					/>
					<FeatureCard
						icon={Zap}
						title="Instant Rollbacks"
						description="Mistake in production? Rollback to any previous deployment in one click."
					/>
				</div>
			</div>
		</section>
	);
};

const Frameworks = () => {
	const frameworks = [
		{ name: "Next.js", color: "hover:text-white" },
		{ name: "React", color: "hover:text-blue-400" },
		{ name: "Vue", color: "hover:text-green-400" },
		{ name: "Svelte", color: "hover:text-orange-400" },
		{ name: "Angular", color: "hover:text-red-500" },
		{ name: "Nuxt", color: "hover:text-green-500" },
	];

	return (
		<section className="py-20 border-t border-white/10 bg-black/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
					Works with your favorite tools
				</p>
				<div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70">
					{frameworks.map((fw) => (
						<div key={fw.name} className={`text-2xl font-bold text-gray-600 transition-colors cursor-default ${fw.color}`}>
							{fw.name}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

const CodeSection = () => {
	return (
		<section className="py-24 relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-sm text-purple-400 mb-6">
							<Code2 size={16} />
							<span>Developer Experience</span>
						</div>
						<h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
							Preview every commit. <br />
							Collaborate instantly.
						</h2>
						<p className="text-gray-400 text-lg mb-8 leading-relaxed">
							Stop sharing screenshots. Orbit generates a unique preview URL for every pull request,
							so your team can review the real app before it merges.
						</p>

						<ul className="space-y-4">
							{[
								"Automatic HTTPS for every deployment",
								"Instant cache invalidation",
								"Serverless Functions built-in"
							].map((item, i) => (
								<li key={i} className="flex items-center gap-3 text-gray-300">
									<CheckCircle2 className="text-green-500" size={20} />
									{item}
								</li>
							))}
						</ul>
					</div>

					<div className="relative">
						{/* Decorative blob */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10" />

						<div className="rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden shadow-2xl">
							<div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
								<div className="flex items-center gap-2">
									<Github size={16} className="text-gray-400" />
									<span className="text-sm text-gray-300 font-mono">orbit/website</span>
								</div>
								<div className="text-xs text-gray-500">Pull Request #42</div>
							</div>

							<div className="p-4 space-y-4">
								<div className="flex gap-3">
									<div className="mt-1">
										<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white font-bold">
											JD
										</div>
									</div>
									<div className="flex-1">
										<div className="bg-white/5 rounded-lg p-3 border border-white/10">
											<p className="text-sm text-gray-300 mb-2">
												I've updated the hero section colors. <span className="text-purple-400 font-bold">@OrbitBot</span> can you deploy a preview?
											</p>
										</div>
									</div>
								</div>

								<div className="flex gap-3">
									<div className="mt-1">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
											<span className="text-white font-bold text-xs">O</span>
										</div>
									</div>
									<div className="flex-1">
										<div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
											<div className="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
												<span className="text-sm font-bold text-white">Orbit Bot</span>
												<span className="text-xs text-gray-500">Just now</span>
											</div>
											<div className="p-3">
												<p className="text-sm text-gray-300 mb-3">
													Deployment successful! Here is your preview:
												</p>
												<div className="flex items-center gap-3 p-2 bg-black/30 rounded border border-white/10 group cursor-pointer hover:border-blue-500/50 transition-colors">
													<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
													<span className="text-sm text-blue-400 font-mono truncate">
														orbit-website-git-hero-update-orbit.app
													</span>
													<ArrowRight size={14} className="ml-auto text-gray-500 group-hover:text-blue-400" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

const CTA = () => {
	return (
		<section className="py-24 relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 pointer-events-none" />
			<div className="max-w-4xl mx-auto px-4 text-center relative z-10">
				<h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 tracking-tight">
					Ready to launch?
				</h2>
				<p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
					Join 100,000+ developers building the future of the web with Orbit.
					Start for free, scale when you need to.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors">
						Start Deploying Free
					</button>
					<button className="w-full sm:w-auto px-8 py-4 bg-black border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
						Contact Sales
					</button>
				</div>
			</div>
		</section>
	);
};

const Footer = () => {
	return (
		<footer className="border-t border-white/10 bg-black pt-16 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
					<div>
						<h3 className="text-white font-bold mb-4">Product</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Infrastructure</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Previews</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Edge Functions</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Analytics</a></li>
						</ul>
					</div>
					<div>
						<h3 className="text-white font-bold mb-4">Resources</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Documentation</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Guides</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Help Center</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Changelog</a></li>
						</ul>
					</div>
					<div>
						<h3 className="text-white font-bold mb-4">Company</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">About</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Blog</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Careers</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Contact</a></li>
						</ul>
					</div>
					<div>
						<h3 className="text-white font-bold mb-4">Legal</h3>
						<ul className="space-y-2">
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</a></li>
							<li><a href="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</a></li>
						</ul>
					</div>
				</div>
				<div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-xs">O</span>
						</div>
						<span className="text-gray-400 text-sm">© 2024 Orbit Inc. All rights reserved.</span>
					</div>
					<div className="flex gap-6">
						<Github className="text-gray-500 hover:text-white cursor-pointer" size={20} />
						<div className="text-gray-500 hover:text-white cursor-pointer font-bold">𝕏</div>
					</div>
				</div>
			</div>
		</footer>
	);
};


