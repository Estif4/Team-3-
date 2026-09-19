import { api } from "./axios";
import type {
    Task,
    CreateTaskData,
    UpdateTaskData,
} from "../stores/boardSlice";

export async function getBoardTasks(boardId: string): Promise<Task[]> {
    const { data } = await api.get<any>(`/boards/${boardId}/tasks`);
    return Array.isArray(data) ? data : data.tasks || [];
}

export async function getTask(_boardId: string, taskId: string): Promise<Task> {
    const { data } = await api.get<any>(`/tasks/${taskId}`);
    return data.task || data;
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
    const { board, ...rest } = taskData;
    const { data } = await api.post<any>(`/boards/${board}/tasks`, rest);
    return data.task || data;
}

export async function updateTask(
    _boardId: string,
    taskId: string,
    taskData: UpdateTaskData
): Promise<Task> {
    const { data } = await api.patch<any>(`/tasks/${taskId}`, taskData);
    return data.task || data;
}

export async function deleteTask(_boardId: string, taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
}