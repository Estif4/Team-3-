// src/App.tsx — new top-level file, this is the entry point now
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './stores/index'
import { restoreSession } from './stores/authSlice'
import LoginPage from './pages/Login'
import MainApp from './MainApp'   // your file above, renamed and moved here

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, booting } = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-gray-500">
        Loading…
      </div>
    )
  }

  return user ? <MainApp /> : <LoginPage />
}