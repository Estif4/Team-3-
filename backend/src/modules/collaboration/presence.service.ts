import { Server, Socket } from "socket.io";
import { ActiveUser } from "./collaboration.types";

class PresenceService {
    // Tracks socketId -> ActiveUser
    private activeUsers = new Map<string, ActiveUser>();

    joinBoard(io: Server, socket: Socket, boardId: string, userId: string) {
        socket.join(boardId);
        this.activeUsers.set(socket.id, { userId, boardId, socketId: socket.id });
        
        // Notify others in the board room
        socket.to(boardId).emit("user_joined", { userId });
    }

    leaveBoard(io: Server, socket: Socket, boardId: string, userId: string) {
        socket.leave(boardId);
        this.activeUsers.delete(socket.id);
        socket.to(boardId).emit("user_left", { userId });
    }

    handleDisconnect(io: Server, socket: Socket) {
        const user = this.activeUsers.get(socket.id);
        if (user) {
            io.to(user.boardId).emit("user_left", { userId: user.userId });
            this.activeUsers.delete(socket.id);
        }
    }
}

export const presenceService = new PresenceService();