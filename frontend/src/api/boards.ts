import type { Board } from "../stores/boardSlice";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

async function handleResponse(
    response: Response
) {
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

export async function getBoards(): Promise<Board[]> {
    const response = await fetch(
        `${API_URL}/boards`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await handleResponse(response);

    return data.boards || data;
}

export async function getBoard(
    boardId: string
): Promise<Board> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    const data = await handleResponse(response);

    return data.board || data;
}

export async function createBoard(data: {
    title: string;
    description?: string;
}): Promise<Board> {
    const response = await fetch(
        `${API_URL}/boards`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await handleResponse(response);

    return result.board || result;
}

export async function updateBoard(
    boardId: string,
    data: {
        title?: string;
        description?: string;
    }
): Promise<Board> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await handleResponse(response);

    return result.board || result;
}

export async function deleteBoard(
    boardId: string
): Promise<void> {
    const response = await fetch(
        `${API_URL}/boards/${boardId}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    await handleResponse(response);
}