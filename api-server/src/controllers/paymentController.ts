import { Request, Response, NextFunction } from "express";
import { IPaymentController } from "../interfaces/controller/IPaymentController.js";
import { IPaymentService } from "../interfaces/service/IPaymentService.js";
import { stripe } from "../config/stripe.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";

class PaymentController implements IPaymentController {
	private paymentService: IPaymentService
	constructor(service: IPaymentService) {
		this.paymentService = service
	}
	async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string
			const successUrl = process.env.FRONTEND_URL + "/payment-success?session_id="
			const cancelUrl = process.env.FRONTEND_URL + "/projects"
			const { session, status } = await this.paymentService.createCheckoutSession(userId, successUrl, cancelUrl)
			if (!session || !status) {
				res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ url: null, message: "No session , already pro member" })
				return
			}
			res.json({ url: session.url, sessionId: session.id });
		} catch (error) {
			next(error)
		}
	}
	async cancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id as string
			await this.paymentService.handleCancelSubscription(userId)
			res.json({
				message: "Subscription cancelled successfully",
				status: true
			});
		} catch (error) {
			next(error)
		}
	}
	async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const sig = req.headers['stripe-signature']
			let event;
			const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string

			event = stripe.webhooks.constructEvent(req.body, sig ?? "", endpointSecret);

			await this.paymentService.handleWebhookEvent(event)
			res.json({ received: true });
		} catch (error) {
			next(error)
		}
	}
}

export default PaymentController