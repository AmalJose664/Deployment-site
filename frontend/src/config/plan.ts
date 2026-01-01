import {
	FiServer,
	FiSlash,
	FiStar,
	FiLink,
	FiPackage,
	FiHardDrive,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { IoIosCube, IoMdCloudDone } from "react-icons/io";

export interface IPlans {
	FREE: {
		name: string;
		slug: string;
		pricePerMonth: number;
		maxProjects: number;
		maxDailyDeployments: number;
		totalBandwidthGB: number
		features: string[];
	};
	PRO: {
		name: string;
		slug: string;
		pricePerMonth: number;
		maxProjects: number;
		maxDailyDeployments: number;
		totalBandwidthGB: number
		features: string[];
	};
}
export const PLANS: IPlans = {
	FREE: {
		name: "FREE",
		slug: "Starter",
		pricePerMonth: 0,
		maxProjects: 8,
		maxDailyDeployments: 8,
		totalBandwidthGB: 100,
		features: [
			"Basic hosting",
			"Up to 8 projects",
			"Max 8 deployments daily",
			"100GB Total Bandwidth",
			"No custom sub domains"
		],
	},
	PRO: {
		name: "PRO",
		slug: "Pro",
		pricePerMonth: 5,
		maxProjects: 20,
		maxDailyDeployments: 40,
		totalBandwidthGB: 1000,
		features: [
			"Priority builds",
			"Custom sub domains",
			"Up to 20 projects",
			"Max 40 deployments daily",
			"1TB Total Bandwidth",
			"More resources"
		],
	},
} as const;
export interface IPlanIcons {
	FREE: {
		features: { text: string, Icon: IconType }[];
	};
	PRO: {
		features: { text: string, Icon: IconType }[];
	};
}
export const PlanIcons: IPlanIcons = {

	FREE: {
		features: [
			{ text: "Basic hosting", Icon: FiServer },
			{ text: "Up to 8 projects", Icon: IoIosCube },
			{ text: "Max 8 deployments daily", Icon: IoMdCloudDone },
			{ text: "100GB Total Bandwidth", Icon: FiHardDrive },
			{ text: "No custom sub domains", Icon: FiSlash },
		],
	},
	PRO: {
		features: [
			{ text: "Priority builds", Icon: FiStar },
			{ text: "Custom sub domains", Icon: FiLink },
			{ text: "Up to 20 projects", Icon: IoIosCube },
			{ text: "Max 40 deployments daily", Icon: IoMdCloudDone },
			{ text: "1TB Total Bandwidth", Icon: FiHardDrive },
			{ text: "More resources", Icon: FiPackage },
		],
	},
}