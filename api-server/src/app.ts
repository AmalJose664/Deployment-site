import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import passport from "passport";
import "./config/passport.js";
import authRouter from "./routes/authRoute.js";

import { errorHandler } from "./middlewares/globalErrorHandler.js";
import projectRouter from "./routes/projectRoutes.js";
import deploymentRouter from "./routes/deploymentRoute.js";
import internalRoutes from "./routes/containerRoutes.js";

const app = express();
dotenv.config();
const httpServer = createServer(app);

app.use(
	cors({
		origin: "*",
		// methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		credentials: true,
		// allowedHeaders: ["Content-Type", "Authorization"],
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

//for logging purpose for requests
app.use((req: any, res: any, next: any) => {
	const time = new Date();
	console.log(`\n----${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}----- ${req.path} ------${req.method}`);
	next();
});

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/deployment", deploymentRouter);

// ------- CONTAINER ROUTES--------------

app.use("/api/internal", internalRoutes);

// --------------------------------------

app.get("/", (req, res) => {
	res.json({ status: "working" });
	return;
});

app.use(errorHandler);

connectDB();
export default httpServer;
