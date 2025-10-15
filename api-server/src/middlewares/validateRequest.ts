import { NextFunction, Request, Response } from "express";
import z from "zod";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS_CODE } from "../utils/statusCodes.js";
type source = "body" | "query";

export function validateRequest<T extends z.ZodObject>(schema: T, source: source) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { body, query } = req;
        const result = schema.safeParse(source === "body" ? body : query);

        if (result.error || !result.success) {
            const messages = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
            console.log("validation error zod ");
            next(new AppError(`${source} validation error =>` + messages, HTTP_STATUS_CODE.BAD_REQUEST, result.error));
        }

        Object.assign(source === "body" ? req.body : req.query, result.data);
        next();
    };
}

export function validateBody<T extends z.ZodObject>(schema: T) {
    return validateRequest(schema, "body");
}
export function validateQuery<T extends z.ZodObject>(schema: T) {
    return validateRequest(schema, "query");
}
