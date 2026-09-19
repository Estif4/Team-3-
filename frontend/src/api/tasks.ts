import type {
    Task,
    CreateTaskData,
    UpdateTaskData,
} from "../stores/boardSlice";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handleResponse(response: Response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            "Something went wrong"
        );
    }

    return data;
}

export async function getBoardTasks(
    boardId: string
): Promise<Task[]> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}/tasks`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await handleResponse(response);

    return data.tasks || data;
}

export async function getTask(
    boardId: string,
    taskId: string
): Promise<Task> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}/tasks/${taskId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await handleResponse(response);

    return data.task || data;
}

export async function createTask(
    taskData: CreateTaskData
): Promise<Task> {
    const response = await fetch(
        `${API_URL}/boards/${taskData.board}/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        }
    );

    const data = await handleResponse(response);

    return data.task || data;
}

export async function updateTask(
    boardId: string,
    taskId: string,
    taskData: UpdateTaskData
): Promise<Task> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}/tasks/${taskId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        }
    );

    const data = await handleResponse(response);

    return data.task || data;
}

export async function deleteTask(
    boardId: string,
    taskId: string
): Promise<void> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}/tasks/${taskId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    await handleResponse(response);
}