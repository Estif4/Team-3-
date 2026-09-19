import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

<<<<<<< Updated upstream
  
=======
>>>>>>> Stashed changes
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";

dotenv.config();

const app: Application = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth & User routes (supports both /api and /api/v1 prefixes)
app.use("/api/auth", authRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "API is running smoothly" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;