// src/pages/login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../stores/index'

import { loginUser, registerUser, clearAuthError } from '../stores/authSlice'


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AVATAR_COLORS = ['#0572B8', '#16A34A', '#DC2626', '#D97706', '#7C3AED', '#DB2777']

function fieldError(fieldErrors: { field: string; message: string }[], name: string) {
  return fieldErrors.find((f) => f.field === name)?.message
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { status, error, fieldErrors, user } = useSelector((s: RootState) => s.auth)

  const [form, setForm] = useState({
    displayName: '', email: '', password: '', confirmPassword: '',
  })
  const [localError, setLocalError] = useState<string | null>(null)

  if (user) { navigate('/board', { replace: true }); }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setLocalError(null)
  }

  const switchMode = (m: 'login' | 'register') => {
    setMode(m)
    setLocalError(null)
    dispatch(clearAuthError())
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (mode === 'login') {
      if (!EMAIL_RE.test(form.email)) return setLocalError('Enter a valid email address.')
      if (!form.password) return setLocalError('Password is required.')
      const res = await dispatch(loginUser({ email: form.email.trim(), password: form.password }))
      if (loginUser.fulfilled.match(res)) navigate('/board', { replace: true })
      return
    }

    // register mode — client-side checks before hitting the network
    if (form.displayName.trim().length < 2) return setLocalError('Display name must be at least 2 characters.')
    if (!EMAIL_RE.test(form.email)) return setLocalError('Enter a valid email address.')
    if (form.password.length < 6) return setLocalError('Password must be at least 6 characters.')
    if (form.password !== form.confirmPassword) return setLocalError('Passwords do not match.')

    const res = await dispatch(registerUser({
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'MEMBER',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    }))
    if (registerUser.fulfilled.match(res)) navigate('/board', { replace: true })
  }

  const showError = localError ?? error

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F8FA] px-4">
      <h1 className="mb-1 text-2xl font-bold tracking-tight">
        Swentex<span className="text-[#0572B8]">BOARD</span>
      </h1>
      <p className="mb-8 text-sm text-[#6B7280]">Work together. Stay in sync.</p>

      <div className="w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <div className="mb-6 flex rounded-md border border-[#E5E7EB] p-1 text-sm">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded py-1.5 font-medium transition ${mode === 'login' ? 'bg-[#0572B8] text-white' : 'text-[#6B7280]'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 rounded py-1.5 font-medium transition ${mode === 'register' ? 'bg-[#0572B8] text-white' : 'text-[#6B7280]'}`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {showError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {showError}
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Display Name</label>
              <input
                name="displayName" value={form.displayName} onChange={onChange}
                placeholder="Tsehaynesh"
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#0572B8] focus:ring-2 focus:ring-[#0572B8]/30"
              />
              {fieldError(fieldErrors, 'displayName') && (
                <p className="text-xs text-red-600">{fieldError(fieldErrors, 'displayName')}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={onChange}
              placeholder="you@company.com"
              className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#0572B8] focus:ring-2 focus:ring-[#0572B8]/30"
            />
            {fieldError(fieldErrors, 'email') && (
              <p className="text-xs text-red-600">{fieldError(fieldErrors, 'email')}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={onChange}
              placeholder="••••••••"
              className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#0572B8] focus:ring-2 focus:ring-[#0572B8]/30"
            />
            {fieldError(fieldErrors, 'password') && (
              <p className="text-xs text-red-600">{fieldError(fieldErrors, 'password')}</p>
            )}
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange}
                placeholder="••••••••"
                className="w-full rounded-md border border-[#E5E7EB] px-3 py-2.5 text-sm outline-none focus:border-[#0572B8] focus:ring-2 focus:ring-[#0572B8]/30"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-md bg-[#0572B8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#04619c] disabled:opacity-50"
          >
            {status === 'loading'
              ? (mode === 'login' ? 'Signing in…' : 'Creating account…')
              : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  )
}