import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface UserReference {
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
}

export interface Task {
    _id: string;
    board: string;

    title: string;
    description: string;

    status: TaskStatus;
    priority: TaskPriority;

    dueDate?: string | null;

    assignedTo?: UserReference | string | null;

    createdBy: UserReference | string;

    tags: string[];

    completedAt?: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    board: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    assignedTo?: string | null;
    tags?: string[];
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string | null;
    assignedTo?: string | null;
    tags?: string[];
}

export interface Board {
    _id: string;
    title: string;
    description: string;

    owner: UserReference | string;

    members: UserReference[];

    tasks?: Task[];

    createdAt: string;
    updatedAt: string;
}

interface BoardState {
    boards: Board[];
    currentBoard: Board | null;

    tasks: Task[];

    loading: boolean;
    error: string | null;
}

const initialState: BoardState = {
    boards: [],
    currentBoard: null,

    tasks: [],

    loading: false,
    error: null,
};

const boardSlice = createSlice({
    name: "board",

    initialState,

    reducers: {
        setBoards(state, action: PayloadAction<Board[]>) {
            state.boards = action.payload;
        },

        setCurrentBoard(state, action: PayloadAction<Board | null>) {
            state.currentBoard = action.payload;

            if (action.payload?.tasks) {
                state.tasks = action.payload.tasks;
            }
        },

        addBoard(state, action: PayloadAction<Board>) {
            state.boards.push(action.payload);
        },

        updateBoard(state, action: PayloadAction<Board>) {
            const index = state.boards.findIndex(
                (board) => board._id === action.payload._id
            );

            if (index !== -1) {
                state.boards[index] = action.payload;
            }

            if (state.currentBoard?._id === action.payload._id) {
                state.currentBoard = action.payload;

                if (action.payload.tasks) {
                    state.tasks = action.payload.tasks;
                }
            }
        },

        removeBoard(state, action: PayloadAction<string>) {
            state.boards = state.boards.filter(
                (board) => board._id !== action.payload
            );

            if (state.currentBoard?._id === action.payload) {
                state.currentBoard = null;
                state.tasks = [];
            }
        },

        setTasks(state, action: PayloadAction<Task[]>) {
            state.tasks = action.payload;
        },

        addTask(state, action: PayloadAction<Task>) {
            state.tasks.unshift(action.payload);
        },

        updateTask(state, action: PayloadAction<Task>) {
            const index = state.tasks.findIndex(
                (task) => task._id === action.payload._id
            );

            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },

        removeTask(state, action: PayloadAction<string>) {
            state.tasks = state.tasks.filter(
                (task) => task._id !== action.payload
            );
        },

        changeTaskStatus(
            state,
            action: PayloadAction<{
                taskId: string;
                status: TaskStatus;
            }>
        ) {
            const task = state.tasks.find(
                (task) => task._id === action.payload.taskId
            );

            if (task) {
                task.status = action.payload.status;

                if (action.payload.status === "done") {
                    task.completedAt = new Date().toISOString();
                } else {
                    task.completedAt = null;
                }
            }
        },

        changeTaskPriority(
            state,
            action: PayloadAction<{
                taskId: string;
                priority: TaskPriority;
            }>
        ) {
            const task = state.tasks.find(
                (task) => task._id === action.payload.taskId
            );

            if (task) {
                task.priority = action.payload.priority;
            }
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        clearTasks(state) {
            state.tasks = [];
        },
    },
});

export const {
    setBoards,
    setCurrentBoard,
    addBoard,
    updateBoard,
    removeBoard,

    setTasks,
    addTask,
    updateTask,
    removeTask,
    changeTaskStatus,
    changeTaskPriority,

    setLoading,
    setError,
    clearTasks,
} = boardSlice.actions;

export default boardSlice.reducer;