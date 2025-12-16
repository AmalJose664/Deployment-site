
import { redirect } from "next/navigation";

import PaymentSuccess from "@/app/(marketing)/payment-success/PaymentSuccess";
export const metadata = {
	title: "Payment Verfiy",
	description:
		"Verify your payment",
};
export default function SuccessPage({ searchParams }: any) {
	const sessionId = searchParams.session_id;

	if (!sessionId) {
		redirect("/");
	}

	return <PaymentSuccess sessionId={sessionId} />;
}
