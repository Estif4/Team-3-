/// <reference path="./types/express.d.ts" />
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import app from "./app";
import { setupSocketHandlers } from "./modules/collaboration/collaboration.socket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Create HTTP Server wrapping Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS and credentials support for cookies
const io = new SocketIOServer(server, {
  cors: {
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Setup collaboration socket handlers (presence, task editing, disconnects)
setupSocketHandlers(io);

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "MERN backend is running" });
});

connectDb()
  .then(() => {
    console.log("MongoDB Connected Successfully");
    server.listen(PORT, () => {
      console.log(`Server & WebSockets running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  });
