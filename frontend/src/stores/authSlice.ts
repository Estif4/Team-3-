// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api,  } from '../api/axios'
import type { User, AuthResponse, RegisterPayload, LoginPayload, FieldError } from '../types'

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'failed'
  booting: boolean          // true until restoreSession resolves once, at app start
  error: string | null
  fieldErrors: FieldError[]
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  booting: true,
  error: null,
  fieldErrors: [],
}

export const restoreSession = createAsyncThunk('auth/restore', async () => {
  const { data } = await api.get<{ user: User }>('/users/me')
  return data.user
})

// src/store/authSlice.ts — only the type annotation and cast change
import type { ApiErrorShape } from '../api/axios'

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: ApiErrorShape }>(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', body)
      return data
    } catch (err) {
      return rejectWithValue(err as ApiErrorShape)   // was `err as ApiError`
    }
  }
)

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: ApiErrorShape }>(
  'auth/register',
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', body)
      return data
    } catch (err) {
      return rejectWithValue(err as ApiErrorShape)
    }
  }
)
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout')   // server clears the cookie — JS can't clear an httpOnly cookie itself
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => { state.error = null; state.fieldErrors = [] },
  },
  extraReducers: (builder) => {
    const pending = (s: AuthState) => { s.status = 'loading'; s.error = null; s.fieldErrors = [] }
    const fulfilled = (s: AuthState, a: { payload: AuthResponse }) => {
      s.status = 'idle'
      s.user = a.payload.user
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
      .addCase(logoutUser.fulfilled, (s) => { s.user = null })
      .addCase(restoreSession.pending, (s) => { s.booting = true })
      .addCase(restoreSession.fulfilled, (s, a) => { s.booting = false; s.user = a.payload })
      .addCase(restoreSession.rejected, (s) => { s.booting = false; s.user = null })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer