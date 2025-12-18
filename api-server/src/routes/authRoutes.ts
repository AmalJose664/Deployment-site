import { Router } from "express";
import passport from "passport";
import {
	checkAuth,
	getAuthenticatedUser,
	getAuthenticatedUserDetails,
	oAuthLoginCallback,
	refresh,
	userLogout,
	verifyAuth,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.get("/", authenticateToken, checkAuth);
authRouter.get("/verify", authenticateToken, verifyAuth);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/github", passport.authenticate("github", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), oAuthLoginCallback);
authRouter.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: "/login" }), oAuthLoginCallback);

authRouter.post("/refresh", refresh);
authRouter.post("/logout", userLogout);
authRouter.get("/me", authenticateToken, getAuthenticatedUser);
authRouter.get("/me/full", authenticateToken, getAuthenticatedUserDetails);

export default authRouter;
