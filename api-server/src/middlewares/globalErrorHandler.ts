import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    console.log("New error 🎉🎉🎉🎉🎉🕳️ ", err);
    if (!(err instanceof AppError)) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            message = `${field} already exists`;
            statusCode = 400;
        } else {
            console.error("Unhandled Error:", err);
            message = "Something went wrong, please try again later.";
        }
    }
    const errorResponse = {
        message,
        statusCode,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };
    res.status(statusCode).json(errorResponse);
};
