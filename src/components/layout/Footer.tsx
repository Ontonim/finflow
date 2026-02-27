import Link from "next/link";
import { TrendingUp, Twitter, Linkedin, Github, Mail } from "lucide-react";

const footerLinks = {
  Topics: [
    { label: "Markets", href: "/category/markets" },
    { label: "Investing", href: "/category/investing" },
    { label: "Insurance", href: "/category/insurance" },
    { label: "Loans", href: "/category/loans" },
    { label: "Crypto", href: "/category/crypto" },
    { label: "Economy", href: "/category/economy" },
  ],
  Resources: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Advertise", href: "/advertise" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      {/* Newsletter CTA */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl font-bold text-white mb-1"
              >
                Stay ahead of the markets
              </h3>
              <p className="text-slate-400 text-sm">
                Get AI-curated finance news delivered to your inbox every morning.
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-lg font-bold text-white"
              >
                FinFlow<span className="text-emerald-400">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              AI-powered financial intelligence for investors, savers, and professionals in the USA and UK.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Mail, href: "mailto:hello@finflow.ai", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} FinFlow AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Content is AI-generated for informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
