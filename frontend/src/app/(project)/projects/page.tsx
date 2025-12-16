import Navbar from "@/components/Navbar"
import ProjectContent from "./ProjectsPageContent"
import { SITE_NAME } from "@/config/constants";
export const metadata = {
	title: "Projects | " + SITE_NAME,
	description:
		"User Projects page",
};
const page = () => {
	return (
		<div>
			<Navbar className="" />
			<ProjectContent />
		</div>
	)
}
export default page