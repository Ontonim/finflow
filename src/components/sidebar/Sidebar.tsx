import AdBanner from "@/components/ads/AdBanner";
import { Mail, TrendingUp } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import { IBlog } from "@/models/Blog";

interface SidebarProps {
  relatedPosts?: Pick<
    IBlog,
    "_id" | "title" | "slug" | "excerpt" | "category" | "featuredImage" | "readingTime" | "createdAt" | "sourcePublisher"
  >[];
}

export default function Sidebar({ relatedPosts = [] }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Sidebar Ad — 300×600 */}
      <div className="sticky top-24">
        <AdBanner
          slot="SIDEBAR_SLOT_ID"
          format="rectangle"
          label="Sponsored"
          style={{ width: "100%", minHeight: 280 }}
        />
      </div>

      {/* Market Data Widget */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-800">Live Markets</h3>
        </div>
        {/* TradingView Widget */}
        <div className="rounded-lg overflow-hidden">
          <iframe
            src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=NASDAQ%3AAAPL&interval=D&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=%5B%5D&theme=light&style=1&timezone=exchange&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=NASDAQ%3AAAPL"
            style={{ width: "100%", height: 200 }}
            frameBorder={0}
            allowTransparency
            scrolling="no"
            allowFullScreen
            title="Market chart"
          />
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-emerald-400" />
          <h3
            style={{ fontFamily: "'Playfair Display', serif" }}
            className="font-bold text-base"
          >
            Market Briefing
          </h3>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed mb-4">
          AI-curated finance news, market moves, and investment ideas — every morning.
        </p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button className="w-full py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-colors">
          Subscribe Free
        </button>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Related Articles
          </h3>
          <div className="space-y-4">
            {relatedPosts.slice(0, 4).map((post) => (
              <BlogCard
                key={String(post._id)}
                blog={post}
                variant="compact"
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
