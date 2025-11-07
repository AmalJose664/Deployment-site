import jwt from "jsonwebtoken";
import { Express } from "express";

export const generateAccessToken = (user: Express.User | undefined) => {
    if (!user) {
        throw new Error("Error creating token");
    }
    const token = jwt.sign(
        {
            id: user?.id,
            email: user?.email,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.NODE_ENV === "production" ? "15m" : "1h" },
    );
    return token;
};

export const generateRefreshToken = (user: Express.User | undefined) => {
    if (!user) {
        throw new Error("Error creating token");
    }
    const token = jwt.sign(
        {
            id: user?.id,
            email: user?.email,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1d" },
    );
    return token;
};
