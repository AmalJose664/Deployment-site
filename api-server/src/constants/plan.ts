export interface IPlans {
    FREE: {
        name: string;
        slug: string;
        pricePerMonth: number;
        maxProjects: number;
        customDomains: boolean;
        features: string[];
    };
    PRO: {
        name: string;
        slug: string;
        pricePerMonth: number;
        maxProjects: number;
        customDomains: boolean;
        features: string[];
    };
}
export const PLANS: IPlans = {
    FREE: {
        name: "FREE",
        slug: "free",
        pricePerMonth: 0,
        maxProjects: 3,
        customDomains: false,
        features: ["Basic hosting", "100 build minutes/month"],
    },
    PRO: {
        name: "PRO",
        slug: "pro",
        pricePerMonth: 20,
        maxProjects: 10,
        customDomains: true,
        features: ["Priority builds", "Custom domains", "More resources"],
    },
} as const;
