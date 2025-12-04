import Stripe from "stripe";

export interface IPaymentService {
	createCheckoutSession(userId: string, successUrl: string, cancelUrl: string): Promise<{ session: Stripe.Checkout.Session | null, status: boolean }>
	handleWebhookEvent(event: Stripe.Event): Promise<void>
}