import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate((location.state as any)?.from || "/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      setError(err.message || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="mx-auto w-12 h-12 rounded-xl bg-brass-500 grid place-items-center mb-4">
            <Shield className="w-6 h-6 text-ink-950" />
          </div>
          <h1 className="text-2xl font-bold text-white">IS Audit</h1>
          <p className="text-sm text-slate-400 mt-1">
            Information Security Audit Management System
          </p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Use your organisation account to continue.
          </p>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Email
          </label>
          <div className="relative mb-4">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Password
          </label>
          <div className="relative mb-5">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              required
              className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <button
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-ink-900 text-white text-sm font-semibold hover:bg-ink-800 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
