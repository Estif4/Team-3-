// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api, TOKEN_KEY, ApiError } from '../api/axios'
import type { User, AuthResponse, RegisterPayload, LoginPayload, FieldError } from '../types'

interface AuthState {
    user: User | null
    token: string | null
    status: 'idle' | 'loading' | 'failed'
    error: string | null
    fieldErrors: FieldError[]
}

// there is no /auth/me endpoint yet, so we restore the user object
// we saved at login time — good enough until the backend adds one
function loadStoredUser(): User | null {
    const raw = localStorage.getItem('syncboard_user')
    return raw ? (JSON.parse(raw) as User) : null
}

const initialState: AuthState = {
    user: loadStoredUser(),
    token: localStorage.getItem(TOKEN_KEY),
    status: 'idle',
    error: null,
    fieldErrors: [],
}

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: ApiError }>(
    'auth/register',
    async (body, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponse>('/auth/register', body)
            return data
        } catch (err) {
            return rejectWithValue(err as ApiError)
        }
    }
)

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: ApiError }>(
    'auth/login',
    async (body, { rejectWithValue }) => {
        try {
            const { data } = await api.post<AuthResponse>('/auth/login', body)
            return data
        } catch (err) {
            return rejectWithValue(err as ApiError)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem('syncboard_user')
            state.user = null
            state.token = null
        },
        clearAuthError: (state) => { state.error = null; state.fieldErrors = [] },
    },
    extraReducers: (builder) => {
        const pending = (s: AuthState) => { s.status = 'loading'; s.error = null; s.fieldErrors = [] }
        const fulfilled = (s: AuthState, a: { payload: AuthResponse }) => {
            s.status = 'idle'
            s.user = a.payload.user
            s.token = a.payload.token
            localStorage.setItem(TOKEN_KEY, a.payload.token)
            localStorage.setItem('syncboard_user', JSON.stringify(a.payload.user))
        }
        const rejected = (s: AuthState, a: any) => {
            s.status = 'failed'
            s.error = a.payload?.message ?? 'Request failed'
            s.fieldErrors = a.payload?.fieldErrors ?? []
        }
        builder
            .addCase(registerUser.pending, pending)
            .addCase(registerUser.fulfilled, fulfilled)
            .addCase(registerUser.rejected, rejected)
            .addCase(loginUser.pending, pending)
            .addCase(loginUser.fulfilled, fulfilled)
            .addCase(loginUser.rejected, rejected)
    },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
