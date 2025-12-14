"use client"
import React from 'react';
import { FcGoogle, } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from 'next/link';
import { GoogleLoginButton } from '../components/GoogleLogin';

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RootState } from '@/store/store';
import ThemeSwitcher from '@/components/ThemeIcon';
import TitleWithLogo from '@/components/TitleWithLogo';


export default function SignupPage() {
	const router = useRouter();
	const user = useSelector((state: RootState) => state.userReducer);

	useEffect(() => {
		const verifySessionCode = () => {
			localStorage.clear()
		}
		verifySessionCode()
	}, [router]);
	return (<>
		<div className="relative min-h-screen flex items-center justify-center p-4">

			<div className="absolute top-8 left-8">
				<Link href="/" className=' hover:no-underline'>
					<TitleWithLogo />
				</Link>
			</div>

			<div className="absolute top-8 right-8">
				<span className="font-bold text-primary"><ThemeSwitcher className='' /></span>
			</div>


			<div className="w-full max-w-md p-8 space-y-8 rounded-lg">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-primary mb-4">
						Sign Up
					</h1>
					<p className="text-primary">
						Sign up to deploy your project
					</p>
				</div>

				<div className="mt-8 group">
					<GoogleLoginButton
						className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-900 dark:border-gray-50 hover:bg-gray-100 hover:text-gray-950 text-gray-100 font-semibold rounded-lg shadow-md transition-colors duration-100 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 !transition-none"
					>
						<FcGoogle className='mr-2' />
						<span className="text-primary group-hover:text-primary dark:text-white dark:group-hover:text-neutral-900"
						>Sign in with Google</span>
					</GoogleLoginButton>
				</div>
				<div className="mt-8 group">
					<button
						type="button"
						className="w-full  inline-flex items-center justify-center px-4 py-3 border border-gray-900 dark:border-gray-50 hover:bg-gray-100 hover:text-gray-950  text-gray-100 font-semibold rounded-lg shadow-md transition-colors duration-100 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 !transition-none"
					>
						<FaGithub className='mr-2 text-primary group-hover:text-primary dark:text-white dark:group-hover:text-neutral-900' />
						<span className="text-primary group-hover:text-primary dark:text-white dark:group-hover:text-neutral-900"
						>Sign in with Github</span>
					</button>
				</div>
				<div className="mt-12 flex items-center justify-between flex-col text-some-less">
					Already have an account?
					<Link href={"/login"} className='m-auto mt-2 text-blue-400 hover:underline'>
						Log in
					</Link>
				</div>
			</div>
		</div>
	</>
	);
}
