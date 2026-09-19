import { api } from "./axios";
import type { Board } from "../stores/boardSlice";

export async function getBoards(): Promise<Board[]> {
    const { data } = await api.get<any>("/boards");
    return Array.isArray(data) ? data : data.boards || [];
}

export async function getBoard(boardId: string): Promise<Board> {
    const { data } = await api.get<any>(`/boards/${boardId}`);
    return data.board || data;
}

export async function createBoard(data: {
    title: string;
    description?: string;
}): Promise<Board> {
    const { data: res } = await api.post<any>("/boards", data);
    return res.board || res;
}

export async function updateBoard(
    boardId: string,
    data: {
        title?: string;
        description?: string;
    }
): Promise<Board> {
    const { data: res } = await api.patch<any>(`/boards/${boardId}`, data);
    return res.board || res;
}

export async function deleteBoard(boardId: string): Promise<void> {
    await api.delete(`/boards/${boardId}`);
}