import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-slate-100" style={{ fontFamily: "'Playfair Display', serif" }}>
          404
        </p>
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-3xl font-bold text-slate-900 -mt-4 mb-3"
        >
          Article Not Found
        </h1>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          This page may have been removed, renamed, or is temporarily unavailable. Check our homepage for the latest finance news.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            ← Go Home
          </Link>
          <Link
            href="/category/markets"
            className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:border-emerald-400 hover:text-emerald-700 transition-colors"
          >
            Browse Markets
          </Link>
        </div>
      </div>
    </div>
  );
}
