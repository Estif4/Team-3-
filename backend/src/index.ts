import { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import app from "./app";

dotenv.config();


const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDb().then(() => {
    console.log("MongoDB Connected Successfully");
}).catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit process with failure if DB connection fails
});

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "MERN backend is running" });
});

app.listen(PORT, () => {
  
  console.log(`Server running on http://localhost:${PORT}`);
});
