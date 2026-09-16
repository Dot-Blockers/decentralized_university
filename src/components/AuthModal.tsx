import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Github,
  ArrowRight,
  Shield,
  GraduationCap,
  Database,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closeAuthModal,
  setAuthModalTab,
  loginUser,
  registerUser,
  clearAuthError,
} from "../store/slices/authSlice";

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authModalTab, loading, error, isMongo } = useAppSelector(
    (state) => state.auth
  );

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [github, setGithub] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalTab === "login") {
      dispatch(loginUser({ email: email.trim(), password }));
    } else {
      dispatch(
        registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          github: github.trim(),
          role,
        })
      );
    }
  };

  const handleQuickFillAdmin = () => {
    dispatch(clearAuthError());
    setEmail("umair@dotblockers.com");
    setPassword("admin123");
    setRole("admin");
    if (authModalTab === "register") {
      setName("Umair Riaz");
      setGithub("umair-riaz");
    }
  };

  const handleQuickFillStudent = () => {
    dispatch(clearAuthError());
    setEmail("alex.student@decuniversity.com");
    setPassword("student123");
    setRole("student");
    if (authModalTab === "register") {
      setName("Alex Rivera");
      setGithub("alex-rivera-web3");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      id="auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) dispatch(closeAuthModal());
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
        id="auth-modal-container"
      >
        {/* Header decoration bar */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 p-6 text-white relative">
          <button
            onClick={() => dispatch(closeAuthModal())}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2.5 mb-2">
            <span className="inline-flex items-center space-x-1.5 bg-white/15 px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-100 uppercase tracking-wider backdrop-blur-xs">
              <Database className="h-3 w-3 text-emerald-300" />
              <span>MongoDB Auth Storage</span>
            </span>
          </div>

          <h3 className="text-2xl font-display font-extrabold text-white">
            {authModalTab === "login" ? "Welcome Back" : "Create Account"}
          </h3>
          <p className="text-blue-100/90 text-xs mt-1">
            {authModalTab === "login"
              ? "Sign in to access your bootcamps, code repositories & admin controls."
              : "Register as a student or faculty member. Credentials persist in MongoDB."}
          </p>

          {/* Tab switcher */}
          <div className="flex bg-slate-950/40 p-1 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(setAuthModalTab("login"));
                dispatch(clearAuthError());
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                authModalTab === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-white/75 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(setAuthModalTab("register"));
                dispatch(clearAuthError());
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                authModalTab === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-white/75 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Modal Body Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            {/* Name Field (Register only) */}
            {authModalTab === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* GitHub Username (Register only) */}
            {authModalTab === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  GitHub Profile (Optional)
                </label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="e.g., alex-web3"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              {authModalTab === "register" && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Stored securely with bcrypt 10-round salt encryption.
                </p>
              )}
            </div>

            {/* Role Selection (Register only) */}
            {authModalTab === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      role === "student"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      role === "admin"
                        ? "bg-purple-50 border-purple-500 text-purple-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Instructor</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 text-xs flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer disabled:bg-slate-300"
            >
              <span>
                {loading
                  ? "Saving to MongoDB..."
                  : authModalTab === "login"
                  ? "Sign In to Decentralized University"
                  : "Complete Registration"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Fill Test Accounts */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick Test Credentials (One Click Fill)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickFillAdmin}
                className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <span>Lead Instructor</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  umair@dotblockers.com
                </div>
              </button>

              <button
                type="button"
                onClick={handleQuickFillStudent}
                className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer text-xs"
              >
                <div className="font-bold text-slate-800 flex items-center space-x-1">
                  <GraduationCap className="h-3 w-3 text-emerald-600" />
                  <span>Demo Student</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  alex.student@...
                </div>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Redux Toolkit Auth Store</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-500">
              <Database className="h-3 w-3 text-blue-500" />
              <span>MongoDB Atlas (`users` collection)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
