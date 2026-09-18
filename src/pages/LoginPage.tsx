import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Database, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser, clearAuthError } from "../store/slices/authSlice";
import { useRouter, Link } from "../router";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { navigate } = useRouter();
  const { isAuthenticated, user, loading, error, isMongo } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/courses");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const res = await dispatch(loginUser({ email: email.trim().toLowerCase(), password }));
    if (loginUser.fulfilled.match(res)) {
      if (res.payload.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/courses");
      }
    }
  };

  const handleQuickDemo = (demoType: "student" | "instructor") => {
    if (demoType === "student") {
      setEmail("student@example.com");
      setPassword("student123");
    } else {
      setEmail("umair@dotblockers.com");
      setPassword("admin123");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4">
          <LogIn className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          Welcome to Decentralized University
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to access your Next.js & Web3 courses, bootcamps, and saved progress.
        </p>

        {/* Database Status Badge */}
      
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-2.5">
              <span className="font-bold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-left">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-left">
                  Password
                </label>
                <Link href="/access-status" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                  Forgot or check access code?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
              id="submit-login-button"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          {/* <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3 text-center">
              Quick One-Click Test Accounts
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo("student")}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-left flex items-center space-x-1.5"
              >
                <UserCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Student Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("instructor")}
                className="px-3 py-2 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left flex items-center space-x-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Lead Instructor</span>
              </button>
            </div>
          </div> */}

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 underline underline-offset-2">
                Register free here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
