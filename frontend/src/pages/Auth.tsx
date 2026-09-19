import { useState, useEffect } from "react";
import {
  KanbanSquare,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../stores";
import { loginUser, registerUser, clearAuthError } from "../stores/authSlice";

const AVATAR_COLORS = [
  "#0572B8", // Brand Blue
  "#7C3AED", // Royal Purple
  "#059669", // Emerald
  "#D97706", // Amber
  "#DC2626", // Rose Red
  "#DB2777", // Pink
  "#2563EB", // Cobalt
  "#4F46E5", // Indigo
];

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const { status, error, fieldErrors } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  // Clear errors when switching tabs
  useEffect(() => {
    dispatch(clearAuthError());
  }, [mode, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(loginUser({ email: email.trim(), password }));
    } else {
      dispatch(
        registerUser({
          name: name.trim(),
          displayName: name.trim(),
          email: email.trim(),
          password,
          avatarColor,
        })
      );
    }
  };

  const fillDemoAccount = () => {
    setMode("login");
    setEmail("demo@syncboard.dev");
    setPassword("password123");
  };

  const getFieldError = (fieldName: string) => {
    return fieldErrors.find((e) => e.field === fieldName)?.message;
  };

  const isLoading = status === "loading";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#0572B8]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0572B8] to-[#034A7B] text-white shadow-lg shadow-blue-500/20">
            <KanbanSquare className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            SyncBoard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time collaborative project workspace
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-8">
          {/* Tab Switcher */}
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0572B8] focus:bg-white focus:ring-2 focus:ring-[#0572B8]/15"
                  />
                </div>
                {getFieldError("displayName") && (
                  <p className="mt-1 text-xs text-red-500">
                    {getFieldError("displayName")}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@team.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0572B8] focus:bg-white focus:ring-2 focus:ring-[#0572B8]/15"
                />
              </div>
              {getFieldError("email") && (
                <p className="mt-1 text-xs text-red-500">
                  {getFieldError("email")}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0572B8] focus:bg-white focus:ring-2 focus:ring-[#0572B8]/15"
                />
              </div>
              {getFieldError("password") && (
                <p className="mt-1 text-xs text-red-500">
                  {getFieldError("password")}
                </p>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Avatar Color
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarColor(c)}
                      className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                        avatarColor === c
                          ? "border-slate-900 scale-110 shadow-sm"
                          : "border-white"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0572B8] to-[#0461a0] py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === "login" ? (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <button
              type="button"
              onClick={fillDemoAccount}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-[#0572B8]"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Fill demo credentials</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-400">
          SyncBoard Hackathon 2026 • Real-Time Kanban
        </p>
      </div>
    </div>
  );
}
