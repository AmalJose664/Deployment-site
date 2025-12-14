import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "passport";
import "./config/passport.js";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/globalErrorHandler.js";
import projectRouter from "./routes/projectRoutes.js";
import deploymentRouter from "./routes/deploymentRoutes.js";
import internalRoutes from "./routes/containerRoutes.js";
import logsRouter from "./routes/logsRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();
const httpServer = createServer(app);

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        // methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        // allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use("/api/billing/stripe-webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use((req: any, res: any, next: any) => {
    const time = new Date();
    console.log(`\n----${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}----- ${req.path} ------${req.method}`);
    next();
});
app.use((req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = function (body?: any) {
        const result = originalJson.call(this, body);
        console.log("Response stats>", res.statusCode, ">>> ", res.statusMessage);

        return result;
    };

    next();
});

app.use("/api/analytics", analyticsRouter);
app.use("/api/logs", logsRouter);
app.use("/api/deployments", deploymentRouter);
app.use("/api/projects", projectRouter);
app.use("/api/auth", authRouter);
app.use("/api/billing", paymentRouter);

// ------- CONTAINER ROUTES--------------

app.use("/api/internal", internalRoutes);

// --------------------------------------

app.get("/", (req, res) => {
    console.log(req.headers);
    res.json({ status: "working" });
    return;
});

app.use(errorHandler);

connectDB();
export default httpServer;
