import {
	Rocket,
	Globe,
	Database,
	ServerOff,
	ShieldCheck,
	Zap,
	Layout,
	Code2,
	CheckCircle2,
	XCircle
} from "lucide-react";

export const metadata = {
	title: "Product | Frontend Deployment Platform",
	description:
		"The fastest way to deploy React applications to the global edge. Static hosting, asset storage, and zero configuration.",
};
const page = () => {
	return (
		<>
			<DocsPage />
		</>
	)
}

function DocsPage() {
	return (
		<main className="mx-auto max-w-4xl px-6 py-16">
			{/* Header */}
			<section className="mb-16">
				<h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
				<p className="mt-4 text-lg text-gray-600">
					Everything you need to know to use the platform correctly.
				</p>
			</section>

			{/* Getting Started */}
			<section className="mb-12">
				<h2 className="text-2xl font-semibold">Getting Started</h2>
				<p className="mt-3 text-gray-700">
					This platform is built for frontend-only projects. To get started,
					prepare a React or static frontend application and deploy the
					generated assets.
				</p>
			</section>

			{/* Supported Projects */}
			<section className="mb-12">
				<h2 className="text-2xl font-semibold">Supported Projects</h2>
				<ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
					<li>React applications</li>
					<li>Frontend only applications</li>
					<li>Static assets and frontend-generated files</li>
				</ul>
			</section>

			{/* Platform Limitations */}
			<section className="mb-12">
				<h2 className="text-2xl font-semibold">Platform Limitations</h2>
				<p className="mt-3 text-gray-700">
					The platform intentionally focuses on frontend hosting and storage.
					The following features are not supported:
				</p>
				<ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
					<li>Backend servers or APIs</li>
					<li>Server-side or edge compute</li>
					<li>Serverless functions</li>
					<li>Custom runtimes or background jobs</li>
				</ul>
			</section>

			<section>
				<h2 className="text-2xl font-semibold">Recommended Use Cases</h2>
				<ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
					<li>Frontend-only React apps</li>
					<li>Frontend-only frameworks</li>
					<li>Documentation sites</li>
					<li>Marketing and landing pages</li>
				</ul>
			</section>
		</main>
	);
}
export default page
