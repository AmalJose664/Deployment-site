"use client"
import { TiArrowLeft } from 'react-icons/ti';
import { FiUser, FiMail, FiFolder, FiCalendar, FiClock } from 'react-icons/fi';
import { useGetUserQuery } from "@/store/services/authApi"
import { useRouter } from "next/navigation"
import { IoIosCube, IoMdCloudDone } from 'react-icons/io';
import { formatDate, getElapsedTimeClean } from '@/lib/utils';



const ProfileContent = () => {
	const router = useRouter()
	const { data: user } = useGetUserQuery()

	return (
		<div>
			<div className="min-h-screen bg-gradient-to-br from-background to-slate-100 dark:from-background dark:to-neutral-900">
				<div className="sticky top-0 z-10 dark:bg-neutral-950/80 backdrop-blur-md">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
						<button
							onClick={() => router.back()}
							className="border p-2 dark:hover:bg-zinc-800 hover:bg-slate-200 rounded-lg transition-all duration-200 group shadow-sm hover:shadow-md"
						>
							<TiArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
						</button>
					</div>
				</div>

				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

					<div className="mb-6 dark:bg-neutral-900 bg-white rounded-md border overflow-hidden shadow-lg">
						<div className="px-8 py-6">
							<div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
								<div className="relative">
									<img
										src={user?.profileImage || ""}
										alt={user?.name}
										className="w-16 h-16 rounded-full border-4 shadow-xl bg-transparent"
									/>
									<div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 "></div>
								</div>

								<div className="flex-1 pt-16 sm:pt-0">
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
										{user?.name}
									</h1>
									<p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
										<FiMail className="w-4 h-4" />
										{user?.email}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div className="dark:bg-neutral-900 bg-white rounded-xl border p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
									<p className="text-3xl font-bold text-gray-900 dark:text-white">{user?.projects}</p>
								</div>
								<div className="w-14 h-14  rounded-xl flex items-center justify-center">
									<IoIosCube className="w-7 h-7 " />
								</div>
							</div>
						</div>

						<div className="dark:bg-neutral-900 bg-white rounded-xl border p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Deployments</p>
									<p className="text-3xl font-bold text-gray-900 dark:text-white">{user?.projects}</p>
								</div>
								<div className="w-14 h-14  rounded-xl flex items-center justify-center">
									<IoMdCloudDone className="w-7 h-7 " />
								</div>
							</div>
						</div>

						<div className="dark:bg-neutral-900 bg-white rounded-xl border  p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total BandWidth</p>
									<p className="text-xl font-bold text-gray-900 dark:text-white">101GB/250 </p>
								</div>
								<div className="w-14 h-14  rounded-xl flex items-center justify-center">
									<IoMdCloudDone className="w-7 h-7 " />
								</div>
							</div>
						</div>
					</div>



					<div className="mb-4 px-6 py-4 dark:bg-neutral-900 bg-white rounded-md border">
						<div className="p-3 ">
							<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
								Info
							</h3>
							<div className='mb-4 border-b pb-2'>
								<div className="flex gap-6 items-center">
									<span>
										<FiUser className="size-4" />
									</span>
									<div className="">
										<p className="text-xs text-less mb-1">Full Name</p>
										<p className="text-base font-medium text-primary">{user?.name}</p>
									</div>
								</div>
							</div>
							<div className='mb-4 border-b pb-2'>
								<div className="flex gap-6 items-center">
									<span>
										<FiMail className="size-4" />
									</span>
									<div className="">
										<p className="text-xs text-less mb-1">Email Address</p>
										<p className="text-base font-medium text-primary">{user?.email}</p>
									</div>
								</div>
							</div>
							<div className='mb-4 border-b pb-2'>
								<div className="flex gap-6 items-center">
									<span>
										<FiCalendar className="size-4" />
									</span>
									<div className="">
										<p className="text-xs text-less mb-1">Joined Date</p>
										<p className="text-base font-medium text-primary">{formatDate(user?.createdAt)}</p>
									</div>
								</div>
							</div>
							<div className='mb-4 border-b pb-2'>
								<div className="flex gap-6 items-center">
									<span>
										<FiClock className="size-4" />
									</span>
									<div className="">
										<p className="text-xs text-less mb-1">Member Since</p>
										<p className="text-base font-medium text-primary">{getElapsedTimeClean(user?.createdAt)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	)
}
export default ProfileContent