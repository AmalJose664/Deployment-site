import { z } from "zod";
import mongoose from "mongoose";

export const mongoIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid MongoDB ObjectId" });
