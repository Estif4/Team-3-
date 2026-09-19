import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { presenceService } from "./presence.service";
import { editingService } from "./editing.service";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_hackathon_key";

export const setupSocketHandlers = (io: Server) => {
    
    // 1. JWT Authentication Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error: No token"));

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            socket.data.userId = decoded.id; // Attach secure user ID to the socket
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    // 2. Event Listeners
    io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId; // Securely pulled from JWT, not the client
        console.log(`🔌 Client connected: ${socket.id} (User: ${userId})`);

        // --- Presence Events ---
        socket.on("join_board", ({ boardId }) => {
            presenceService.joinBoard(io, socket, boardId, userId);
        });

        socket.on("leave_board", ({ boardId }) => {
            presenceService.leaveBoard(io, socket, boardId, userId);
        });

        // --- Editing Events ---
        socket.on("task_editing_started", ({ boardId, taskId }) => {
            editingService.startEditing(io, socket, boardId, taskId, userId);
        });

        socket.on("task_editing_stopped", ({ boardId, taskId }) => {
            editingService.stopEditing(io, socket, boardId, taskId, userId);
        });

        // --- Disconnect Hook ---
        socket.on("disconnect", () => {
            presenceService.handleDisconnect(io, socket);
            editingService.clearUserEdits(io, userId);
            console.log(`🔴 Client disconnected: ${socket.id}`);
        });
    });
};