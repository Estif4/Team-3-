import { Server, Socket } from "socket.io";
import { EditingTask } from "./collaboration.types";

class EditingService {
    // Tracks taskId -> EditingTask
    private activeEdits = new Map<string, EditingTask>();

    startEditing(io: Server, socket: Socket, boardId: string, taskId: string, userId: string) {
        this.activeEdits.set(taskId, { taskId, userId, boardId });
        socket.to(boardId).emit("task_editing_started", { taskId, userId });
    }

    stopEditing(io: Server, socket: Socket, boardId: string, taskId: string, userId: string) {
        this.activeEdits.delete(taskId);
        socket.to(boardId).emit("task_editing_stopped", { taskId, userId });
    }

    // Prevents tasks from staying locked forever if a user abruptly disconnects
    clearUserEdits(io: Server, userId: string) {
        for (const [taskId, edit] of this.activeEdits.entries()) {
            if (edit.userId === userId) {
                this.activeEdits.delete(taskId);
                io.to(edit.boardId).emit("task_editing_stopped", { taskId, userId });
            }
        }
    }
}

export const editingService = new EditingService();