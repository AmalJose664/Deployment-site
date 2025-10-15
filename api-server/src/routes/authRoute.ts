import { Router } from "express";
import passport from "passport";
import { googleLoginCallback, refresh, userLogout } from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), googleLoginCallback);
authRouter.get("/refresh", refresh);
authRouter.get("/logout", userLogout);

export default authRouter;
