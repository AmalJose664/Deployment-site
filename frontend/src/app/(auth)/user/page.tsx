import { SITE_NAME } from "@/config/constants";
import ProfileContent from "./ProfileContent"
export const metadata = {
	title: "User | " + SITE_NAME,
	description:
		"User page",
};
const page = () => {
	return (
		<ProfileContent />
	)
}
export default page