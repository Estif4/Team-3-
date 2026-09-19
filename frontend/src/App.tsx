// src/App.tsx
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './stores/index'
import { restoreSession } from './stores/authSlice'
import LoginPage from './pages/Login'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, booting } = useSelector((s: RootState) => s.auth)
  if (booting) return <div className="grid min-h-screen place-items-center text-sm text-[#6B7280]">Loading…</div>
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function BoardPlaceholder() {
  return <div className="p-8 text-sm text-[#6B7280]">Board goes here.</div>
}

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => { dispatch(restoreSession()) }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/board" element={<ProtectedRoute>
          <BoardPlaceholder />
          </ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/board" replace />} />
      </Routes>
    </BrowserRouter>
  )
}