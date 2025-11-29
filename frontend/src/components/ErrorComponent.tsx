import { useRouter } from 'next/navigation';
import { MdErrorOutline, MdArrowBack } from 'react-icons/md'
import BackButton from './BackButton';


const ErrorComponent = ({ id, field, error }: { error: any, id: string, field: string }) => {
	const router = useRouter()
	return (
		<>
			<div className="sticky top-0 z-10 dark:bg-neutral-950/80 backdrop-blur-md">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
					<BackButton />
				</div>
			</div>
			<div className="min-h-[70vh] relative flex items-center justify-center bg-gray-50 dark:bg-zinc-950">


				<div className="flex flex-col items-center justify-center text-center max-w-md px-6">
					<div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-6">
						<MdErrorOutline className="text-2xl text-red-500" />
					</div>

					<h2 className="text-xl font-semibold mb-3 text-primary">
						Failed to load {field}
					</h2>

					{error.status === 404 ? (
						<p className="text-less mb-6 leading-relaxed">
							{(error as any)?.message ||
								(error as { data?: { message?: string } })?.data?.message ||
								"Resource not found 404"}
						</p>
					) : (
						<p className="text-less mb-6 leading-relaxed">
							{(error as any)?.message ||
								(error as { data?: { message?: string } })?.data?.message ||
								"Something went wrong while loading this content."}
						</p>
					)}

					<button
						onClick={() => window.location.reload()}
						className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-primary rounded-lg font-medium transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		</>
	)
}
export default ErrorComponent