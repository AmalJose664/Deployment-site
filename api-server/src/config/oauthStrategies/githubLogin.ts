import { PassportStatic } from "passport";
import { Strategy as GithubStategy } from "passport-github2";
import { githubLoginStrategy } from "../../controllers/authController.js";

const githubLogin = (passport: PassportStatic) => {
	passport.use(
		new GithubStategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
				callbackURL: `${process.env.API_ENDPOINT}/api/auth/github/callback`,
			},
			githubLoginStrategy,
		),
	);
};

export default githubLogin;
