import clsx from "clsx";
import { GoCheckCircleFill, GoXCircleFill } from "react-icons/go";
import { IoAlertCircleSharp } from "react-icons/io5";
import { MdTableRows } from "react-icons/md";
import { FaRegCirclePause } from "react-icons/fa6";

const StatusIcon = ({ status, className }: { status: string, className?: string }) => {

	switch (status) {
		case 'READY':
			return <GoCheckCircleFill className={clsx("text-emerald-500", className)} size={18} />;
		case 'FAILED':
			return <GoXCircleFill className={clsx("text-red-500", className)} size={18} />;
		case 'CANCELLED':
			return <GoXCircleFill className={clsx("text-red-500", className)} size={18} />;
		case 'BUILDING':
			return <IoAlertCircleSharp className={clsx("text-amber-500", className)} size={18} />;
		case 'QUEUED':
			return <MdTableRows className={clsx("text-amber-300", className)} size={18} />;
		case 'NOT_STARTED':
			return <FaRegCirclePause className={clsx("dark:text-neutral-300 text-neutral-300", className)} size={18} />;
		default:
			return null;
	}
};
export default StatusIcon