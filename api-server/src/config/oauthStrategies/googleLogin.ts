
import { PassportStatic } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleLoginStrategy } from "../../controllers/authController.js";

const googleLogin = (passport: PassportStatic) => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
				callbackURL: `${process.env.API_ENDPOINT}/api/auth/google/callback`,
			},
			googleLoginStrategy,
		),
	);
};

export default googleLogin;
