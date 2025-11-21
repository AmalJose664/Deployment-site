import { cn } from "@/lib/utils"
import { IoCubeSharp } from "react-icons/io5"

interface TitleWithLogoProps {
	logoClassName?: string
	svgClassName?: string
	baseClassName?: string
}
const TitleWithLogo = ({ logoClassName, svgClassName, baseClassName }: TitleWithLogoProps) => {
	return (
		<div className={cn("flex gap-2 items-center border border-transparent px-2 py-1 rounded-md dark:hover:border-neutral-700 hover:border-neutral-500 transition-all duration-300", baseClassName)}>
			<h2 className={cn("font-semibold tracking-wide  uppercase text-sm text-primary", logoClassName)}>
				Lynfera
			</h2>
			<img
				src="/public/icon.svg"
				alt="Cube upside down"
				className="dark:invert"
				height="20"
				width="20" />
			{/* <IoCubeSharp size={20} className={cn("rotate-z-180", svgClassName)} /> */}
		</div>
	)
}
export default TitleWithLogo