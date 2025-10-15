import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid user ID", 400);
    }
    next();
};
