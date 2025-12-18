import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

const authenticate = (passport: PassportStatic) => {
	passport.use(
		new JWTStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.ACCESS_TOKEN_SECRET as string,
			},
			(jwt_payload, done) => {
				try {
					const user = { id: jwt_payload.id, email: jwt_payload.email, name: jwt_payload.name };
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				} catch (error) {
					return done(error, false);
				}
			},
		),
	);
};
export default authenticate;
