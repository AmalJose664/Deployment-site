import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"


const protectedRoutes = ["/projects", "/login/success", "/deployments", "/user"]
const exemptAfterAuthRoutes = ["/login", "/signup"]

export async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname
	const cookies = req.cookies
	const accessToken = cookies.get("access_token")?.value
	const refreshToken = cookies.get("refresh_token")?.value
	// return NextResponse.next()

	if (exemptAfterAuthRoutes.includes(path)) {
		if (accessToken && refreshToken) {
			return NextResponse.redirect(new URL("/", req.url))
		}
	}
	if (protectedRoutes.some((route) => path.startsWith(route))) {
		if (!accessToken) {
			return NextResponse.redirect(new URL("/login", req.url));
		}
		try {
			const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/auth/verify`, {
				headers: {
					'Cookie': `access_token=${accessToken}`
				},
				credentials: 'include'
			})
			if (verifyResponse.status !== 200) {
				if (!refreshToken) {
					return NextResponse.redirect(new URL("/login", req.url));
				}

				const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_ENDPOINT}/auth/refresh`, {
					headers: {
						'Cookie': `refresh_token=${refreshToken}`
					},
					method: "POST",
					credentials: 'include'
				})
				if (!refreshResponse.ok || refreshResponse.status === 401) {

					return NextResponse.redirect(new URL("/login", req.url));
				}
				const response = NextResponse.next()
				const setCookie = refreshResponse.headers.get('set-cookie')

				if (setCookie) {
					response.headers.set("set-cookie", setCookie)
				}

				return response
			}
			return NextResponse.next()
		} catch (error: any) {
			console.log("Auth cheking error on tokens", error.message)
			return NextResponse.redirect(new URL("/login", req.url));
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/projects/:path*", "/projects", "/deployments/:path*", "/deployments", "/login", "/signup", "/auth/:path*"],
}