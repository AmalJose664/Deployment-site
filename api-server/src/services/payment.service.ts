
import Stripe from "stripe";
import { stripe } from "../config/stripe.js";
import { IPaymentService } from "../interfaces/service/IPaymentService.js";
import { IUserRepository } from "../interfaces/repository/IUserRepository.js";
import AppError from "../utils/AppError.js";

class PaymentService implements IPaymentService {
	private userRepo: IUserRepository
	constructor(userRepo: IUserRepository) {
		this.userRepo = userRepo
	}
	async createCheckoutSession(userId: string, successUrl: string, cancelUrl: string): Promise<{ session: Stripe.Checkout.Session | null, status: boolean }> {

		const user = await this.userRepo.findByUserId(userId)
		if (!user) throw new AppError("User not found", 404)
		if (user.plan === "PRO") {
			return {
				session: null, status: false
			}
		}
		const session = await stripe.checkout.sessions.create({
			mode: "subscription",
			line_items: [{ price: "price_1SaX6n2efzyFmja4tb11B8Cs", quantity: 1, }],
			success_url: successUrl + "{CHECKOUT_SESSION_ID}",
			cancel_url: cancelUrl + "/?user=" + userId,
			customer_email: user.email,
			metadata: {
				userId: user._id.toString(),
			},
		})
		return { session, status: true }
	}
	async handleWebhookEvent(event: Stripe.Event): Promise<void> {
		console.log(event.type, " <<  < < << < << <<", event)
		switch (event.type) {
			case 'checkout.session.completed':
				// await this.handleCheckoutCompleted(event.data.object);
				break;
			case 'invoice.payment_succeeded':
				await this.handePaymentSucceed(event);
				break;
			case 'customer.subscription.created':
				// await this.handleSubscriptionCreated(event.data.object);
				break;
			case 'customer.subscription.updated':
				// await this.handleSubscriptionUpdated(event.data.object);
				break;
			case 'customer.subscription.deleted':
				// await this.handleSubscriptionDeleted(event.data.object);
				break;

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}
	}
	async handePaymentSucceed(event: Stripe.Event) {
		const session = event.data.object as Stripe.Checkout.Session
		const userId = session?.metadata?.userId || session.client_reference_id;
		console.log('Payment succed ,, 🎉🎉🎉Checkout completed for user:', userId);
		if (userId) {
			await this.userRepo.updateUserPlans(userId, "PRO")
		}

	}
	async handleSubscriptionDeleted(event: Stripe.Event) {
		console.log('Payment succed ,, 🎉🎉🎉 payment deleted  event:',);
	}
}

export default PaymentService