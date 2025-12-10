"use client";

import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

type PaymentDetails = {
	customerName?: string;
	amountPaid?: string;
	currency?: string;
	valid: boolean;
};

export default function PaymentSuccess({ sessionId }: { sessionId: string }) {
	const [data, setData] = useState<PaymentDetails | null>(null);

	useEffect(() => {
		async function fetchSession() {
			const res = await axiosInstance.get(`/billing/retrieve?session_id=${sessionId}`);
			console.log(res.data)
			setData(res.data);
		}
		fetchSession();
	}, [sessionId]);

	if (!data) return <p>Loading...</p>;

	if (!data.valid) {
		return (
			<div style={{ textAlign: "center", padding: "50px" }}>
				<h1>⚠️ Payment Not Found</h1>
				<p>We could not verify your payment.</p>
				<a href="/">Return Home</a>
			</div>
		);
	}

	return (
		<main style={{ textAlign: "center", padding: "50px" }}>
			<h1>🎉 Payment Successful!</h1>
			<p>Thank you for your purchase.</p>

			<div style={{ marginTop: "20px" }}>
				<p>
					<strong>Customer:</strong> {data.customerName ?? "Guest"}
				</p>
				<p>
					<strong>Amount Paid:</strong> {data.amountPaid} {data.currency}
				</p>
			</div>

			<a href="/" style={{ marginTop: "30px", display: "inline-block" }}>
				Return Home
			</a>
		</main>
	);
}
