import Stripe from "stripe";

export interface IPaymentService {
	createCheckoutSession(userId: string, successUrl: string, cancelUrl: string): Promise<{ session: Stripe.Checkout.Session | null, status: boolean }>
	handleWebhookEvent(event: Stripe.Event): Promise<void>
	handleCancelSubscription(userId: string): Promise<void>
	handleSubscriptionCreate(event: Stripe.Event): Promise<void>
	handleSubscriptionDeleted(event: Stripe.Event): Promise<void>
	handePaymentSucceed(event: Stripe.Event): Promise<void>
}