"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdOutlineLightMode, MdLaptopChromebook } from "react-icons/md";
import { CiDark } from "react-icons/ci";
export default function ThemeSwitcher({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
	const icon =
		nextTheme === "light" ? (
			<MdOutlineLightMode className="dark:text-gray-200 text-gray-800 dark:hover:text-gray-200 hover:text-gray-800 duration-200" />
		) : nextTheme === "dark" ? (
			<CiDark className="dark:text-gray-200 text-gray-800 dark:hover:text-gray-200 hover:text-gray-800 duration-200" />
		) : (
			<MdLaptopChromebook className="dark:text-gray-200 text-gray-800 dark:hover:text-gray-200 hover:text-gray-800 duration-200" />
		);
	const handleClick = () => setTheme(nextTheme)
	return (
		<button
			onClick={handleClick} className={className}
			title={`Switch to ${nextTheme} mode`}
		>
			{icon}
		</button>
	)
}
