import { NextFunction, Request, Response } from "express";
import { Profile, VerifyCallback } from "passport-google-oauth20";

import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { userService } from "../instances.js";
import { UserMapper } from "../mappers/userMapper.js";
import AppError from "../utils/AppError.js";

export const oAuthLoginCallback = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = generateAccessToken(req.user);
        const refreshToken = generateRefreshToken(req.user);

        res.cookie("refresh_token", refreshToken, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("access_token", accessToken, {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000,
        });

        const frontend = process.env.FRONTEND_URL + "/auth/success";
        res.redirect(frontend);
    } catch (error) {
        next(new AppError("Error during google callback", 500, error));
    }
};

export const googleLoginStrategy = async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    console.log("strategy google");
    try {
        const user = await userService.googleLoginStrategy(profile);
        const doneUser = {
            id: user._id,
            email: user.email,
        };
        done(null, doneUser);
    } catch (error) {
        done(error, false);
    }
};

export const githubLoginStrategy = async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        console.log("strategy github");
        const user = await userService.githubLoginStrategy(profile);
        const doneUser = {
            id: user._id,
            email: user.email,
        };
        done(null, doneUser);
    } catch (error) {
        done(error, false);
    }
};

export const refresh = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        console.log("No refresh token");
        res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({ message: "No cookie provided" });
        return;
    }
    try {
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
        console.log(decoded, "Trying to decode refesh");

        const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });
        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000,
        });
        return res.status(200).json({ ok: true });
    } catch (error) {
        next(new AppError("Error during token valiadation", 500, error));
        console.log("Error in token valiadation ");
    }
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ ok: true, randomNumber: Math.floor(Math.random() * 1000) });
};

export const verifyAuth = (req: Request, res: Response) => {
    return res.status(200).json({ valid: true, user: req.user });
};

export const userLogout = (req: Request, res: Response) => {
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");
    res.status(HTTP_STATUS_CODE.OK).json({ message: "user logged out" });
};

export const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string;
        const user = await userService.getUser(userId);
        if (!user) {
            res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: "user not found" });
            return;
        }
        const response = UserMapper.toUserResponse(user);
        res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
        next(error);
    }
};
export const getAuthenticatedUserDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string;
        const { user, bandwidth } = await userService.getUserDetailed(userId);
        if (!user) {
            res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ error: "user not found" });
            return;
        }
        const response = UserMapper.toUserDetailedResponse({ user, bandwidth });
        res.status(HTTP_STATUS_CODE.OK).json(response);
    } catch (error) {
        next(error);
    }
};
