import { useRouter } from 'next/navigation';
import { MdErrorOutline, MdArrowBack } from 'react-icons/md'


const ErrorComponent = ({ id, field, error }: { error: any, id: string, field: string }) => {
	const router = useRouter()
	return (
		<div className="min-h-screen relative flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
			<button
				onClick={() => router.back()}
				className="absolute top-6 left-6 p-2.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 text-sm font-medium"
			>
				<MdArrowBack className="text-lg" />
				<span>Back</span>
			</button>

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
	)
}
export default ErrorComponent