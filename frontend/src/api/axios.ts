import axios from 'axios'
import type { FieldError } from '../types'

export const TOKEN_KEY = 'syncboard_token'

export const api = axios.create({ baseURL: '/api' })

// attach the JWT to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// custom error carrying both a display message and per-field errors
export class ApiError extends Error {
    fieldErrors: FieldError[]
    constructor(message: string, fieldErrors: FieldError[] = []) {
        super(message)
        this.fieldErrors = fieldErrors
    }
}

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) localStorage.removeItem(TOKEN_KEY)

        const data = error.response?.data
        // auth.schema.ts: { error: "Validation failed", details: [{field, message}] }
        // auth.controller.ts catch block: { error: "Email already in use" } / { error: "Invalid credentials" }
        const message =
            data?.error ??
            (error.code === 'ERR_NETWORK' ? 'Cannot reach the server.' : 'Something went wrong.')
        return Promise.reject(new ApiError(message, data?.details ?? []))
    }
)
