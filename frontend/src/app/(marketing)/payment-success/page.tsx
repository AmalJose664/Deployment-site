// app/success/page.tsx
import { redirect } from "next/navigation";

export default async function SuccessPage({ searchParams }: any) {
	const sessionId = searchParams.session_id;

	if (!sessionId) {
		redirect("/");
	}


	return (
		<main style={{ textAlign: "center", padding: "50px" }}>
			<h1>🎉 Payment Successful!</h1>
			<p>Thank you for your purchase.</p>

			<div style={{ marginTop: "20px" }}>
				<strong>Customer:</strong>
				<br />
				<strong>Amount Paid:</strong>
			</div>

			<a href="/" style={{ marginTop: "30px", display: "inline-block" }}>
				Return Home
			</a>
		</main>
	);
}
