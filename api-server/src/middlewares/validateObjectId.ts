import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const validateObjectId = (parameter: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const id = req.params[parameter];
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return next(new AppError("Invalid ID === > " + id, 400));
		}
		next();
	};
};
