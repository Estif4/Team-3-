export interface ActiveUser {
    userId: string;
    boardId: string;
    socketId: string;
}

export interface EditingTask {
    taskId: string;
    userId: string;
    boardId: string;
}