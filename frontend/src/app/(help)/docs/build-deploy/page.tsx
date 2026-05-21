import { CodeComponent, LinkComponent } from "@/components/docs/HelperComponents"
import { SITE_NAME } from "@/config/constants"



export const metadata = {
	title: "Build & Deploy | " + SITE_NAME,
	description:
		"Instructions and best practices for building and deploying static applications efficiently.",
};




const page = () => {
	return (
		<main className="  px-4 space-y-16">
			<div className="w-full border-b pb-2">
				<h2 className="text-4xl">Build and Deploys</h2>
			</div>
			<section id="build" className="space-y-12">
				<div>
					<h2>Builds</h2>
					<p className="mt-4">{SITE_NAME} automatically performs a build every time you start a deployment in the UI</p>
				</div>

				<section id="build-infra" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 
				bg-white ">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<h2 className="text-xl font-semibold">Build infrastructure</h2>
							<p className="text-sm text-primary mt-4">When you initiate a build, {SITE_NAME} creates a secure, isolated virtual environment for your project:</p>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li>Your code is built in a consistent, clean environment</li>
								<li>Build processes can't interfere with other users' applications</li>
								<li>Security is maintained through complete isolation</li>
							</ul>
						</div>
					</div>
				</section>
				<section id="build-trigger" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<h2 className="text-xl font-semibold">How builds are triggered</h2>
							<p className="text-sm text-primary mt-4">Builds can be initiated in the following ways:</p>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li>
									<strong>Dashboard deploy:</strong> Clicking Deploy in the dashboard or creating a new project triggers a build.
								</li>
								<li>
									<strong>Git push:</strong> Builds can also be triggered via code push events from Git providers if the project is connected via any Git provider App. <LinkComponent href="/docs/git-integration#github-gi-deploy">Learn more</LinkComponent>
								</li>
							</ul>
						</div>
					</div>
				</section>
				<section id="build-customize" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<h2 className="text-xl font-semibold">Build customization</h2>
							<p className="text-sm text-primary mt-4">Commands like build command and the install command are initially set by {SITE_NAME}. You can override them depending on your framework in the <LinkComponent href="/projects/">project settings tab</LinkComponent> or while creating a new project.</p>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li><strong>Build Command:</strong> Default build command (npm run build).</li>
								<li><strong>Install Command:</strong> Default install command is npm install.</li>
								<li><strong>Output Directory:</strong> Specify the folder containing your final build output (e.g., dist or build).</li>
								<li><strong>Root Directory:</strong> Path Where your code is in your repo (e.g., / or /frontend) Default value: / . Your app will not be able to access files outside of that directory. You also cannot use .. to move up a level</li>
							</ul>
						</div>
					</div>
				</section>
				<section id="build-env-vars" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<h2 className="text-xl font-semibold">Environment variables</h2>
							<p className="text-sm mt-4 text-primary ">{SITE_NAME} can automatically inject environment variables such as API keys, database connections, or feature flags during the build:</p>
							<p className="text-sm mt-4 text-primary">{SITE_NAME} injects your environment variables into the build process during install and build..</p>
						</div>
					</div>
				</section>
				<section id="build-deployment" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Build output and deployment</h2>
								<p className="text-sm mt-4 text-primary ">Once the build completes successfully:</p>
							</div>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li>{SITE_NAME} uploads your build artifacts (static files and other assets) to the public cloud (s3).</li>
								<li>A unique deployment URL is generated (apart from the project link) (Both URLs can be used to access the deployment).</li>
								<li>Logs and build details are available in each <strong>project</strong> section of the dashboard.</li>
							</ul>
							<div>
								<p className="text-sm mt-4 text-primary ">If the build fails or times out, {SITE_NAME} provides diagnostic logs in the dashboard to help you troubleshoot. For common solutions, see our build <LinkComponent href="/docs/troubleshoot/">troubleshooting docs</LinkComponent>.</p>

							</div>
						</div>
					</div>
				</section>
				<section id="build-status" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto">
						<div className="px-4 py-4">
							<h2 className="text-xl font-semibold">Build Status</h2>
							<p className="text-sm text-primary mt-4">Every deployment and project has a status that reflects its current state. Understanding these statuses helps you track your deployment progress.</p>

							<div className="mt-6 space-y-4">
								<div className="border-l-1 border-gray-300 dark:border-gray-600 pl-4">
									<h3 className="font-semibold text-base">NOT_STARTED</h3>
									<p className="text-sm text-primary mt-1">Initial status when a project is first created. No deployment has been attempted yet.</p>
									<p className="text-xs text-muted-foreground mt-1">Applies to: Project only</p>
								</div>

								<div className="w-full h-[1px] bg-muted" />

								<div className="border-l-1 border-neutral-300 dark:border-neutral-600 pl-4">
									<h3 className="font-semibold text-base">QUEUED</h3>
									<p className="text-sm text-primary mt-1">Deployment has been requested but hasn't started yet. Waiting for available build resources (similar to AWS ECS or GitHub Actions runner queue).</p>
									<p className="text-xs text-muted-foreground mt-1">Applies to: Project and Deployment</p>
								</div>

								<div className="w-full h-[1px] bg-muted" />

								<div className="border-l-1 border-yellow-400 dark:border-yellow-600 pl-4">
									<h3 className="font-semibold text-base">BUILDING</h3>
									<p className="text-sm text-primary mt-1">Build has started. The first task (git clone) is in progress. Goes through 6 steps: cloning files, verifying cloned files, installing, building, verifying output files, and uploading assets.</p>
									<p className="text-xs text-muted-foreground mt-1">Applies to: Project (first deployment only) and Deployment</p>
									<p className="text-xs text-amber-700 dark:text-amber-200/80 mt-1">Note: For subsequent deployments, the project shows READY (from previous deployment) while the new deployment shows BUILDING.</p>
								</div>

								<div className="w-full h-[1px] bg-muted" />

								<div className="border-l-1 border-green-400 dark:border-green-600 pl-4">
									<h3 className="font-semibold text-base">READY</h3>
									<p className="text-sm text-primary mt-1">Build completed successfully. Project is live and accessible.</p>
									<p className="text-xs text-muted-foreground mt-1">Applies to: Project and Deployment</p>
								</div>

								<div className="w-full h-[1px] bg-muted" />

								<div className="border-l-1 border-red-400 dark:border-red-600 pl-4">
									<h3 className="font-semibold text-base">CANCELLED</h3>
									<p className="text-sm text-primary mt-1">Build was cancelled by the system during verification steps due to limits (number of files, file size), invalid code, or dangerous code detected in source files.</p>
									<p className="text-xs text-muted-foreground mt-1">Applies to: Project (first deployment only) and Deployment</p>
									<p className="text-xs text-amber-700 dark:text-amber-200/80 mt-1">Note: For subsequent deployments, the project remains READY (previous deployment is still active).</p>
								</div>

								<div className="w-full h-[1px] bg-muted" />

								<div className="border-l-1 border-red-400 dark:border-red-600 pl-4">
									<h3 className="font-semibold text-base">FAILED</h3>
									<p className="text-sm text-primary mt-1">Build failed during install or build steps due to errors in your source code, build configuration, or rarely due to runner errors.</p>
									<p className="text-xs text-muted-foreground mt-1">Applies to: Project (first deployment only) and Deployment</p>
									<p className="text-xs text-amber-700 dark:text-amber-200/80 mt-1">Note: For subsequent deployments, the project remains READY (previous deployment is still active).</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section 2: Build Flow Chart */}
				<section id="build-flow" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white mt-6">
					<div className="overflow-x-auto">
						<div className="px-4 py-4">
							<h2 className="text-xl font-semibold">Build Flow</h2>
							<p className="text-sm text-primary mt-4">This diagram shows how a deployment moves through different states from creation to completion.</p>

							<div className="mt-6 flex flex-col items-center space-y-0 py-4">
								{/* NOT_STARTED */}
								<div className="border-1 border-gray-400 rounded-lg px-6 py-3 bg-gray-50 dark:bg-gray-900 min-w-[200px] text-center z-10 relative">
									<div className="font-semibold">NOT_STARTED</div>
									<div className="text-xs text-muted-foreground mt-1">Project created</div>
								</div>

								{/* Line */}
								<div className="flex flex-col items-center relative z-0 -my-1">
									<div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700"></div>
									<div className="absolute top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-white dark:bg-[#101010] px-2 py-1 rounded-md border border-gray-100 dark:border-gray-800 whitespace-nowrap">Deployment requested</div>
									<div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-solid border-t-gray-300 dark:border-t-gray-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
								</div>

								{/* QUEUED */}
								<div className="border-1 border-neutral-500 rounded-lg px-6 py-3 bg-neutral-50 dark:bg-neutral-950 min-w-[200px] text-center z-10 relative">
									<div className="font-semibold">QUEUED</div>
									<div className="text-xs text-muted-foreground mt-1">Waiting for build runner</div>
								</div>

								{/* Line */}
								<div className="flex flex-col items-center relative z-0 -my-1">
									<div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700"></div>
									<div className="absolute top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-white dark:bg-[#101010] px-2 py-1 rounded-md border border-gray-100 dark:border-gray-800 whitespace-nowrap">Build runner available</div>
									<div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-solid border-t-gray-300 dark:border-t-gray-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
								</div>

								{/* BUILDING */}
								<div className="border-1 dark:border-yellow-100/50 border-yellow-500 rounded-lg px-6 py-4 bg-yellow-50 dark:bg-yellow-950/60 min-w-[200px] z-10 relative">
									<div className="font-semibold text-center mb-3">BUILDING</div>
									<div className="text-xs space-y-1.5 text-left">
										<div className="flex items-center space-x-2">
											<span className="text-yellow-600 dark:text-yellow-400">1.</span>
											<span>Cloning files</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-yellow-600 dark:text-yellow-400">2.</span>
											<span>Verifying cloned files</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-yellow-600 dark:text-yellow-400">3.</span>
											<span>Installing dependencies</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-yellow-600 dark:text-yellow-400">4.</span>
											<span>Building application</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-yellow-600 dark:text-yellow-400">5.</span>
											<span>Verifying output files</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-yellow-600 dark:text-yellow-400">6.</span>
											<span>Uploading assets to S3</span>
										</div>
									</div>
									<div className="text-xs text-muted-foreground mt-2 text-center">
										Steps 3-4 can be skipped via env vars
									</div>
								</div>

								{/* Connection from BUILDING to branching point */}
								<div className="flex flex-col items-center w-full relative z-0 -my-1">
									<div className="w-0.5 h-10 bg-gray-300 dark:bg-gray-700"></div>
								</div>

								{/* Decision Point */}
								<div className="relative w-full max-w-[664px] mx-auto mt-0 pb-4">
									{/* Horizontal line spanning the three options */}
									<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[464px] h-0.5 bg-gray-300 dark:bg-gray-700"></div>

									<div className="flex w-full justify-between">
										{/* CANCELLED path */}
										<div className="flex flex-col items-center w-[200px]">
											<div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-700 relative">
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-gray-300 dark:border-t-gray-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
											</div>
											<div className="text-xs text-red-600 dark:text-red-400 font-medium text-center bg-white dark:bg-[#101010] z-10 px-2 py-1 mt-1">
												Verification failed<br />(steps 2 or 5)
											</div>
											<div className="w-0.5 h-6 bg-red-300 dark:bg-red-700 relative -mt-1">
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-red-300 dark:border-t-red-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
											</div>
											<div className="border-1 border-red-500 rounded-lg px-6 py-3 bg-red-50 dark:bg-red-950/60 min-w-[200px] text-center z-10 mt-1">
												<div className="font-semibold">CANCELLED</div>
												<div className="text-xs text-muted-foreground mt-1">Invalid/dangerous code</div>
											</div>
										</div>

										{/* FAILED path */}
										<div className="flex flex-col items-center w-[200px]">
											<div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-700 relative">
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-gray-300 dark:border-t-gray-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
											</div>
											<div className="text-xs text-red-600 dark:text-red-400 font-medium text-center bg-white dark:bg-[#101010] z-10 px-2 py-1 mt-1">
												Build error<br />(steps 3 or 4)
											</div>
											<div className="w-0.5 h-6 bg-red-300 dark:bg-red-700 relative -mt-1">
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-red-300 dark:border-t-red-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
											</div>
											<div className="border border-red-500 rounded-lg px-6 py-3 bg-red-50 dark:bg-red-950/60 min-w-[200px] text-center z-10 mt-1">
												<div className="font-semibold">FAILED</div>
												<div className="text-xs text-muted-foreground mt-1">Source code errors</div>
											</div>
										</div>

										{/* READY path */}
										<div className="flex flex-col items-center w-[200px]">
											<div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-700 relative">
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-gray-300 dark:border-t-gray-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
											</div>
											<div className="text-xs text-green-600 dark:text-green-400 font-medium text-center bg-white dark:bg-[#101010] z-10 px-2 py-1 mt-1">
												All steps<br />successful
											</div>
											<div className="w-0.5 h-6 bg-green-300 dark:bg-green-700 relative -mt-1">
												<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-solid border-t-green-300 dark:border-t-green-700 border-t-[6px] border-x-transparent border-x-[5px] border-b-0"></div>
											</div>
											<div className="border border-green-500 rounded-lg px-6 py-3 bg-green-50 dark:bg-green-950/60 min-w-[200px] text-center z-10 mt-1">
												<div className="font-semibold">READY</div>
												<div className="text-xs text-muted-foreground mt-1">Deployment live</div>
											</div>
										</div>
									</div>
								</div>

								{/* Important Note */}
								<div className="mt-6 p-4 bg-neutral-200 dark:bg-neutral-800 border rounded-lg max-w-2xl">
									<h4 className="font-semibold text-sm mb-2">Project Status Behavior</h4>
									<ul className="text-xs space-y-1.5 text-primary">
										<li>• <strong>First deployment:</strong> Project status mirrors deployment status</li>
										<li>• <strong>Subsequent deployments:</strong> Project stays READY (showing previous successful deployment) even if new deployment is BUILDING, FAILED, or CANCELLED</li>
										<li>• <strong>Project updates:</strong> Only when new deployment reaches READY does the project status update and switch to the new deployment</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section 3: Build Duration (Updated) */}
				<section id="build-duration" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white mt-6">
					<div className="overflow-x-auto">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Build Duration</h2>
								<p className="text-sm text-primary mt-4">The total build duration is shown on the {SITE_NAME} <LinkComponent href="/deployments">deployment</LinkComponent> Dashboard and includes all six steps: cloning files, verifying cloned files, installing, building, verifying output files, and uploading assets.</p>
								<p className="text-sm text-primary mt-4">A Build can last for a maximum of 30 minutes. If the build exceeds this time, the deployment will be cancelled and the error will be shown on the Deployment's page saying this message <CodeComponent>Failed to start build runner / Build timeout exceeded</CodeComponent>.</p>
							</div>

							<div className="mt-4">
								<p className="text-less text-sm mt-2">
									{SITE_NAME} enforces strict limits on build execution to ensure platform stability:
								</p>
								<ul className="list-disc pl-5 text-sm mt-3 space-y-1">
									<li><strong>Install Command:</strong> Max 10 minutes.</li>
									<li><strong>Build Command:</strong> Max 15 minutes.</li>
									<li><strong>Total Session:</strong> Max 30 minutes.</li>
								</ul>
							</div>

							<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
								<p className="text-sm"><strong>💡 Tip:</strong> You can skip the install and/or build steps by setting <CodeComponent>LYNFERA_SETTING_SKIP_INSTALL</CodeComponent> or <CodeComponent>LYNFERA_SETTING_SKIP_BUILD</CodeComponent> environment variables. <LinkComponent href="/docs/env-variables#user-configurable">Learn more</LinkComponent></p>
							</div>
						</div>
					</div>
				</section>

				<section id="build-limits" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Limits and resources</h2>
								<p className="text-sm mt-4 text-primary ">{SITE_NAME} enforces certain limits to ensure reliable builds for all users:</p>
							</div>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li><strong>Build timeout:</strong> The maximum build time is 30 minutes. If your build exceeds this limit, it will be terminated, and the deployment fails.</li>
								<li><strong>Concurrency:</strong> Max concurrent builds for each user is decided by their plan (free - 1, pro - 3).</li>
								<li><strong>Container resources:</strong> We fairly give both sets of users (free, pro) container with a limit of 2 vCPUs and 4 GB RAM for now but these values may change in the future.</li>
								<li><strong>Build image:</strong> Builds in {SITE_NAME} get a base image of Node:22-bookworm. You can view the generated image <LinkComponent href="https://hub.docker.com/r/amal664/lynfera-builds" newPage>here</LinkComponent></li>
							</ul>
						</div>
					</div>
				</section>
			</section>




			<div className="h-[1px] w-full bg-primary" />


			<section id="Deploys" className="space-y-12">
				<div>
					<h2>Deployments</h2>
					<p className="mt-4">A deployment on {SITE_NAME} is the result of a successful build of your project. Each time you deploy, {SITE_NAME} generates a unique URL to the live environment. The current project is also updated based on the deployment status.</p>
				</div>
				<section id="deploy-dashboard" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Using the Dashboard</h2>
								<p className="text-sm mt-4 text-primary ">{SITE_NAME}'s dashboard provides a centralized way to view, manage, and gain insights into your deployments.</p>
								<p className="text-sm mt-4 text-primary ">When you select a deployment from your Project &rarr; Deployments tab, you can view each of the project’s deployments. Each deployment gives you insight into run time, logs, output files.</p>
								<p className="text-sm mt-4 text-primary ">Files &rarr; Static Assets: Files (HTML, CSS, JS) and their sizes.</p>
							</div>
						</div>
					</div>
				</section>
				<section id="deploy-manage" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Managing Deployments</h2>
								<p className="text-sm mt-4 text-primary ">From the Deployments tab, you can:</p>
							</div>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li><strong>Inspect:</strong> View logs and build outputs.</li>
								<li><strong>Promote to Production:</strong> Convert a preview deployment to production (if needed).</li>
							</ul>
						</div>
					</div>
				</section>

				<section id="deploy-env" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Environments</h2>
								<p className="text-sm mt-4 text-primary ">By default, {SITE_NAME} provide only a Production Environment.</p>
							</div>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li><strong>Inspect:</strong>View logs and build outputs.</li>
								<li><strong>Promote to Production:</strong>Convert a preview deployment to production (if needed).</li>
							</ul>
						</div>
					</div>
				</section>
				<section id="deploy-delete" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Delete a deployment.</h2>
								<p className="text-sm mt-4 text-primary ">You can delete failed or cancelled deployments directly from the deployment page using the Delete button.</p>
								<p className="text-base mt-4 text-primary "> For successful deployments, deletion is available only via API: <br />
									<CodeComponent>{process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/projects/[id]/deployments/[deployment_id]</CodeComponent> via a <CodeComponent>DELETE</CodeComponent> method that accepts deployment deletion requests.</p>
								<p className="text-base mt-4 text-primary ">By default this changes project's current deployment to its previous one if current deployment is given to delete.</p>
								<p className="text-base mt-4 text-primary ">This action is strongly discouraged due to the risk of disrupting the active deployment.  This can unintentionally change the active deployment or result in a failed deployment state.</p>
							</div>
						</div>
					</div>
				</section>
				<section id="deploy-redeploy" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Redeploy a project.</h2>
								<p className="text-base mt-4 text-primary ">Redeployment can be done by the project dashboard via three dots &rarr; Create New Deployment.</p>
								<p className="text-sm mt-4 ">Redeployment is required whenever environment variables are added, changed, or updated.</p>
							</div>
						</div>
					</div>
				</section>
				<section id="deploy-promote" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">Promoting Deployments.</h2>
								<p className="text-base mt-4 text-primary ">This is a method to manually chnage your project's current deployment to another old one without creating a new deployment</p>
								<p className="text-base mt-4 text-primary ">
									Promoting an older deployment may alter the currently active version of the project. Users may observe changes to the live site upon refresh.
								</p>
								<p className="text-base mt-4 text-primary ">
									To change a project deployment:
								</p>
							</div>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li>Go to your project's<strong> Deployments </strong>tab</li>
								<li>Click the three dots.</li>
								<li>Select the option of promote deployment</li>
							</ul>
							<p className="text-base mt-4 text-less ">
								You can't change the project to a failed deployment.
							</p>
						</div>
					</div>
				</section>


				<section id="deploy-more" className="scroll-mt-12 border rounded-md overflow-hidden dark:bg-[#101010]/60 bg-white">
					<div className="overflow-x-auto ">
						<div className="px-4 py-4">
							<div>
								<h2 className="text-xl font-semibold">More Actions</h2>
							</div>
							<ul className="px-3 py-1 list-disc space-y-3 mt-3">
								<li><strong>Subdomain:</strong> A new random Subdomain is given to project when it is created. You can change it before or after deployment to have your own custom subdomain.</li>
								<li><strong>Disable/Enabling Project:</strong> Disabling project makes it not accessible to anyone. Accessing the project will display a project disabled page.</li>
								<li><strong>Delete Project:</strong> Deleting project can be done via settings tab of project. This action permanently deletes the project.</li>
							</ul>

						</div>
					</div>
				</section>
			</section>
		</main>
	)

}
export default page