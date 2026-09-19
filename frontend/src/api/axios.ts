// src/api/axios.ts
import axios from 'axios'
import type { FieldError } from '../types'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export interface ApiErrorShape {
  message: string
  fieldErrors: FieldError[]
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response?.data
    const message =
      data?.error ??
      (error.code === 'ERR_NETWORK' ? 'Cannot reach the server.' : 'Something went wrong.')

    const shaped: ApiErrorShape = { message, fieldErrors: data?.details ?? [] }
    return Promise.reject(shaped)
  }
)