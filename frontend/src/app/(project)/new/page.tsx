import Navbar from "@/components/Navbar"
import ProjectForm from "./FormContainer"
import { SITE_NAME } from "@/config/constants";
export const metadata = {
	title: "Create new Project",
	description:
		"Deploy new projects to " + SITE_NAME,
};
const page = () => {
	return (
		<div>
			<Navbar className="" />
			<ProjectForm />
		</div>
	)
}
export default page