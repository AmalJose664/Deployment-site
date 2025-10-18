"use client";
import React from "react";

type GoogleLoginButtonProps = React.PropsWithChildren<{
	className?: string;
}>;
export function GoogleLoginButton({ className, children, ...props }: GoogleLoginButtonProps) {
	const handleLogin = () => {
		window.location.href = process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT + "/auth/google";
	};
	return (
		<button {...props}
			type="button"
			onClick={handleLogin}
			className={className}
		>
			{children}
		</button>
	);
}
