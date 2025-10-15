import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
//user

interface DecodedUser {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface User extends DecodedUser {}
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as DecodedUser;
        req.user = decoded;
        if (!req.user) {
            res.status(401).json({ message: "Please login" });
            return;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
};
