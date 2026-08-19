import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-xl bg-brass-500 grid place-items-center mb-5">
          <ShieldAlert className="w-7 h-7 text-ink-950" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-brass-500 mb-2">
          ERROR 404
        </p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-sm text-slate-400 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brass-500 text-ink-950 text-sm font-semibold hover:opacity-90 transition"
        >
          <Home className="w-4 h-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
