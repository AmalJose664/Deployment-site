import { Request, Response } from "express";
import { Profile, VerifyCallback } from "passport-google-oauth20";

import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { userService } from "../instances.js";

export const googleLoginCallback = (req: Request, res: Response) => {
    try {
        const accessToken = generateAccessToken(req.user);
        const reefreshToken = generateRefreshToken(req.user);

        res.cookie("refresh_token", reefreshToken, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.json({ a_token: accessToken, from: "here we are" });

        // const frontend = process.env.FRONTEND_URL + "/success"
        // res.redirect(frontend)
    } catch (error) {
        console.error("Error during google callback", error);
        res.status(500).json({ message: "Internal server error during login" });
    }
};

export const googleLoginStrategy = async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        const user = await userService.googleLoginStrategy(profile);
        const doneUser = {
            id: user.id,
            email: user.email,
        };
        done(null, doneUser);
    } catch (error) {
        done(error, false);
    }
};

export const refresh = (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: "No cookie provided" });
    }
    try {
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        console.log(decoded);
        const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
        res.json({ accessToken });
    } catch (error) {
        console.log("Error in token valiadation ", error);
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ message: "Error in cookie valiadation" });
    }
};

export const userLogout = (req: Request, res: Response) => {
    res.clearCookie("refresh_token");
    res.status(HTTP_STATUS_CODE.OK).json({ message: "user logged out" });
};
