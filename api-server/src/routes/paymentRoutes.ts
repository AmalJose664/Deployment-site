import express, { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { paymentController } from "../instances.js";

const paymentRouter = Router();



paymentRouter.post("/checkout", authenticateToken, paymentController.checkout.bind(paymentController))
paymentRouter.post("/cancel", authenticateToken, paymentController.cancelSubscription.bind(paymentController))
paymentRouter.post(
	"/stripe-webhook",
	paymentController.webhook.bind(paymentController)
)

export default paymentRouter
