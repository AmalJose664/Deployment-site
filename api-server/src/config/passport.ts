import passport from "passport";
import googleLogin from "./oauthStrategies/googleLogin.js";
import authenticate from "./oauthStrategies/jwt.js";
googleLogin(passport);
authenticate(passport);
