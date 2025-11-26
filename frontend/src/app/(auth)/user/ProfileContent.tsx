"use client"
import { FiUser, FiMail, FiCalendar, FiClock } from 'react-icons/fi';
import { useGetDetailedQuery, } from "@/store/services/authApi"

import { IoIosCube, IoMdCloudDone } from 'react-icons/io';
import { formatBytes, formatDate, getElapsedTimeClean } from '@/lib/utils';
import { MdOutlineStorage } from 'react-icons/md';
import { PLANS } from '@/config/plan';
import { GrPlan } from 'react-icons/gr';
import BackButton from '@/components/BackButton';



const ProfileContent = () => {
	const { data: userDetailed } = useGetDetailedQuery()
	const plan = userDetailed?.plan || "FREE"
	const currentPlan = PLANS[plan]

	return (
		<div>
			<div className="min-h-screen bg-gradient-to-br from-background to-slate-100 dark:from-background dark:to-neutral-900">
				<div className="sticky top-0 z-10 dark:bg-neutral-950/80 backdrop-blur-md">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
						<BackButton />
					</div>
				</div>

				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
					<div className="mb-6 dark:bg-neutral-900 bg-white rounded-md border overflow-hidden shadow-lg">
						<div className="px-8 py-6 flex items-center justify-between">
							<div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
								<div className="relative">
									<img
										src={userDetailed?.profileImage}
										alt={userDetailed?.name || "User Avatar"}
										className="w-16 h-16 rounded-full border-4 shadow-xl bg-transparent"
									/>
									<div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 "></div>
								</div>

								<div className="flex-1 pt-16 sm:pt-0">
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
										{userDetailed?.name}
									</h1>
									<p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
										<FiMail className="w-4 h-4" />
										{userDetailed?.email || ""}
									</p>
								</div>
							</div>
							<div>
								<span
									className={`px-2 py-0.5 rounded-md text-xs font-medium 
      ${plan === "PRO" ? "bg-blue-400 text-white" : "bg-gray-300 text-gray-800"}`}
								>
									{plan}
								</span>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div className="dark:bg-neutral-900 bg-white rounded-xl border p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Projects</p>
									<p className="text-xl font-bold text-gray-900 dark:text-white">
										{userDetailed?.projects || 0} / {currentPlan.maxProjects}
									</p>
								</div>
								<div className="w-14 h-14  rounded-xl flex items-center justify-center">
									<IoIosCube className="w-7 h-7 " />
								</div>
							</div>
							{userDetailed && <div className='h-1 w-full bg-gray-500'>
								<div
									style={{ width: getPercentage(userDetailed?.projects || 0, currentPlan.maxProjects) }}
									className="h-1 bg-blue-400">
								</div>
							</div>
							}
						</div>

						<div className="dark:bg-neutral-900 bg-white rounded-xl border p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Deployments</p>
									<p className="text-xl font-bold text-gray-900 dark:text-white">
										{userDetailed?.deploymentsToday || 0} / {currentPlan.maxDailyDeployments}
									</p>
								</div>
								<div className="w-14 h-14  rounded-xl flex items-center justify-center">
									<IoMdCloudDone className="w-7 h-7 " />
								</div>
							</div>
							{userDetailed && <div className='h-1 w-full bg-gray-500'>
								<div
									style={{ width: getPercentage(userDetailed?.deploymentsToday || 0, currentPlan.maxDailyDeployments) }}
									className="h-1 bg-blue-400">
								</div>
							</div>
							}
						</div>

						<div className="dark:bg-neutral-900 bg-white rounded-xl border  p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total BandWidth</p>
									<p className="text-xl font-bold text-gray-900 dark:text-white">
										{userDetailed &&
											formatBytes(userDetailed?.bandwidthMonthly || 0)
											+ " / " +
											currentPlan.totalBandwidthGB + "GB"
										}
									</p>
								</div>
								<div className="w-14 h-14  rounded-xl flex items-center justify-center">
									<MdOutlineStorage className="w-7 h-7 " />
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
										<p className="text-base font-medium text-primary">{userDetailed?.name}</p>
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
										<p className="text-base font-medium text-primary">{userDetailed?.email}</p>
									</div>
								</div>
							</div>
							<div className='mb-4 border-b pb-2'>
								<div className="flex gap-6 items-center">
									<span>
										<GrPlan className="size-4" />
									</span>
									<div className="">
										<p className="text-xs text-less mb-1">User Plan</p>
										<p className="text-base font-medium text-primary">{userDetailed?.plan || ""}</p>
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
										<p className="text-base font-medium text-primary">{formatDate(userDetailed?.createdAt)}</p>
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
										<p className="text-base font-medium text-primary">{getElapsedTimeClean(userDetailed?.createdAt)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div >
	)
}
export default ProfileContent

function getPercentage(value: number, limit: number) {
	if (limit === 0) return `0%`;
	return `${((value / limit) * 100).toFixed(2)}%`;
}