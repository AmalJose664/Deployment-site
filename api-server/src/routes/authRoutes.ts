import { Router } from "express";
import passport from "passport";
import { checkAuth, getAuthenticatedUser, getAuthenticatedUserDetails, googleLoginCallback, refresh, userLogout, verifyAuth } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.get("/", authenticateToken, checkAuth);
authRouter.get("/verify", authenticateToken, verifyAuth);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), googleLoginCallback);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", userLogout);
authRouter.get("/me", authenticateToken, getAuthenticatedUser)
authRouter.get("/me/full", authenticateToken, getAuthenticatedUserDetails)



export default authRouter;
