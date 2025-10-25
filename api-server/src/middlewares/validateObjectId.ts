import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const validateObjectId = (parameter: string) => {

	return async (req: Request, res: Response, next: NextFunction) => {
		const id = req.params[parameter];
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new AppError("Invalid ID", 400);
		}
		next();
	}
};
