import Navbar from "@/components/Navbar"
import AllDeployments from "./AllDeployments"
import { SITE_NAME } from "@/config/constants";

export const metadata = {
	title: "Deployments | " + SITE_NAME,
	description:
		"User Desployments",
};

const page = () => {
	return (
		<div>
			<Navbar className="" />
			<AllDeployments />
		</div>
	)
}
export default page