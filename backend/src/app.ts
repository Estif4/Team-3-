import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./modules/auth/auth.routes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use("/api/auth", authRoutes);


app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "success", message: "API is running smoothly" });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("🔥 Error:", err.message);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    });
});

export default app;