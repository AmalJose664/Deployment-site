
import { redirect } from "next/navigation";

import PaymentSuccess from "@/components/PaymentSuccess";

export default function SuccessPage({ searchParams }: any) {
	const sessionId = searchParams.session_id;

	if (!sessionId) {
		redirect("/");
	}

	return <PaymentSuccess sessionId={sessionId} />;
}
