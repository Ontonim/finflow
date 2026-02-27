"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/category/markets", label: "Markets" },
  { href: "/category/investing", label: "Investing" },
  { href: "/category/insurance", label: "Insurance" },
  { href: "/category/loans", label: "Loans" },
  { href: "/category/crypto", label: "Crypto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-xl font-bold text-slate-900 tracking-tight"
            >
              FinFlow<span className="text-emerald-600">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </nav>

          {/* Right: Search + Admin */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-emerald-600 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-700 hover:text-emerald-600 border-b border-slate-50 last:border-0 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-3">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex-1 text-center py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:border-emerald-400 transition-colors"
            >
              Search
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex-1 text-center py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
