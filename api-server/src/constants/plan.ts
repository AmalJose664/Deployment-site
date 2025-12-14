export interface IPlans {
    FREE: {
        name: string;
        slug: string;
        pricePerMonth: number;
        maxProjects: number;
        maxDailyDeployments: number;
        subDomains: boolean;
        totalBandwidthGB: number;
        features: string[];
    };
    PRO: {
        name: string;
        slug: string;
        pricePerMonth: number;
        maxProjects: number;
        maxDailyDeployments: number;
        subDomains: boolean;
        totalBandwidthGB: number;
        features: string[];
    };
}
export const PLANS: IPlans = {
    FREE: {
        name: "FREE",
        slug: "Starter",
        pricePerMonth: 0,
        maxProjects: 4,
        maxDailyDeployments: 12,
        totalBandwidthGB: 200,
        subDomains: false,
        features: ["Basic hosting", "Up to 4 projects", "Max 12 deployments daily", "200GB Total Bandwidth", "No custom sub domains"],
    },
    PRO: {
        name: "PRO",
        slug: "Pro",
        pricePerMonth: 15,
        maxProjects: 20,
        maxDailyDeployments: 100,
        totalBandwidthGB: 1000,
        subDomains: true,
        features: [
            "Priority builds",
            "Custom sub domains",
            "Up to 20 projects",
            "Max 100 deployments daily",
            "1TB Total Bandwidth",
            "More resources",
        ],
    },
} as const;
