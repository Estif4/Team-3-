// src/stores/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, TOKEN_KEY, ApiError } from "../api/axios";
import type { User, AuthResponse, RegisterPayload, LoginPayload, FieldError } from "../types";

interface AuthState {
    user: User | null;
    token: string | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
    fieldErrors: FieldError[];
}

function loadStoredUser(): User | null {
    try {
        const raw = localStorage.getItem("syncboard_user");
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

const initialState: AuthState = {
    user: loadStoredUser(),
    token: localStorage.getItem(TOKEN_KEY),
    status: "idle",
    error: null,
    fieldErrors: [],
};

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: ApiError }>(
    "auth/register",
    async (body, { rejectWithValue }) => {
        try {
            const payload = {
                ...body,
                displayName: body.displayName || body.name,
            };
            const { data } = await api.post<AuthResponse>("/auth/register", payload);
            return data;
        } catch (err) {
            return rejectWithValue(err as ApiError);
        }
    }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: ApiError }>(
    "auth/login",
    async (body, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponse>("/auth/login", body);
            return data;
        } catch (err) {
            return rejectWithValue(err as ApiError);
        }
    }
);

export const fetchMe = createAsyncThunk<User, void, { rejectValue: ApiError }>(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get<User>("/users/me");
            return data;
        } catch (err) {
            return rejectWithValue(err as ApiError);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Ignore error on logout
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("syncboard_user");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("syncboard_user");
            state.user = null;
            state.token = null;
            state.status = "idle";
            state.error = null;
            state.fieldErrors = [];
        },
        clearAuthError: (state) => {
            state.error = null;
            state.fieldErrors = [];
        },
    },
    extraReducers: (builder) => {
        const pending = (s: AuthState) => {
            s.status = "loading";
            s.error = null;
            s.fieldErrors = [];
        };

        const fulfilledAuth = (s: AuthState, a: { payload: AuthResponse }) => {
            s.status = "idle";
            const user = {
                ...a.payload.user,
                name: a.payload.user.displayName || a.payload.user.name || "User",
            };
            s.user = user;
            s.token = a.payload.token;
            localStorage.setItem(TOKEN_KEY, a.payload.token);
            localStorage.setItem("syncboard_user", JSON.stringify(user));
        };

        const rejected = (s: AuthState, a: any) => {
            s.status = "failed";
            s.error = a.payload?.message ?? "Request failed";
            s.fieldErrors = a.payload?.fieldErrors ?? [];
        };

        builder
            .addCase(registerUser.pending, pending)
            .addCase(registerUser.fulfilled, fulfilledAuth)
            .addCase(registerUser.rejected, rejected)

            .addCase(loginUser.pending, pending)
            .addCase(loginUser.fulfilled, fulfilledAuth)
            .addCase(loginUser.rejected, rejected)

            .addCase(fetchMe.fulfilled, (s, a) => {
                const user = {
                    ...a.payload,
                    name: a.payload.displayName || a.payload.name || "User",
                };
                s.user = user;
                localStorage.setItem("syncboard_user", JSON.stringify(user));
            })
            .addCase(fetchMe.rejected, (s) => {
                s.user = null;
                s.token = null;
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem("syncboard_user");
            })

            .addCase(logoutUser.fulfilled, (s) => {
                s.user = null;
                s.token = null;
                s.status = "idle";
                s.error = null;
                s.fieldErrors = [];
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
