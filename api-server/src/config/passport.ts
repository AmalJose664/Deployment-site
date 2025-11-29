import passport from "passport";
import googleLogin from "./oauthStrategies/googleLogin.js";
import githubLogin from "./oauthStrategies/githubLogin.js";
import authenticate from "./oauthStrategies/jwt.js";
googleLogin(passport);
githubLogin(passport);

authenticate(passport);
