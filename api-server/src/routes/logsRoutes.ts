import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { logsController } from "../instances.js";

const logsRouter = Router();

logsRouter.get("/", authenticateToken, logsController.test.bind(logsController));
logsRouter.get("/data", authenticateToken, logsController.getData.bind(logsController));

export default logsRouter;
