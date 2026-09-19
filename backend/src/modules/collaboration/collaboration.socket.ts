import { Server, Socket } from "socket.io";
import { presenceService } from "./presence.service";
import { editingService } from "./editing.service";
import { socketAuth } from "../../middleware/auth.middleware";

export const setupSocketHandlers = (io: Server) => {
    // 1. Centralized Socket.IO JWT Authentication Middleware
    io.use(socketAuth);

    // 2. Event Listeners
    io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId; // Securely verified and attached by socketAuth
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