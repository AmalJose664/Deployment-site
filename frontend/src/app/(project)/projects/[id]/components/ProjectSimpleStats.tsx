

import { IoMdGitBranch } from "react-icons/io";

import { MdAccessTime } from "react-icons/md";
import { BsActivity } from "react-icons/bs";
import { IoIosTrendingUp } from "react-icons/io";
import { Project } from "@/types/Project";
const ProjectSimpleStats = ({ project }: { project: Project }) => {


	const mockStats = {
		totalDeployments: project.deployments?.length,
		successRate: 94,
		avgBuildTime: '48s',
		lastDeployed: '2m ago',
	};


	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-8 ">
			<div className=" border rounded-xl p-5 dark:bg-neutral-900 bg-white">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 border rounded-lg">
						<BsActivity className="" size={20} />
					</div>
					<span className="text-sm text-less">Total Deployments</span>
				</div>
				<p className="text-3xl font-semibold">{mockStats.totalDeployments}</p>
			</div>

			<div className=" border  rounded-xl p-5 dark:bg-neutral-900 bg-white">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 border  rounded-lg">
						<IoIosTrendingUp className="" size={20} />
					</div>
					<span className="text-sm text-less">Success Rate</span>
				</div>
				<p className="text-3xl font-semibold">{mockStats.successRate}%</p>
			</div>

			<div className="border rounded-xl p-5 dark:bg-neutral-900 bg-white">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 border  rounded-lg">
						<MdAccessTime className="" size={20} />
					</div>
					<span className="text-sm text-less">Avg Build Time</span>
				</div>
				<p className="text-3xl font-semibold">{mockStats.avgBuildTime}</p>
			</div>

			<div className=" border rounded-xl p-5 dark:bg-neutral-900 bg-white">
				<div className="flex items-center gap-3 mb-2">
					<div className="p-2 border  rounded-lg">
						<IoMdGitBranch className="" size={20} />
					</div>
					<span className="text-sm text-less">Last Deployed</span>
				</div>
				<p className="font-semibold text-sm mt-3">{mockStats.lastDeployed}</p>
			</div>
		</div>
	)
}
export default ProjectSimpleStats