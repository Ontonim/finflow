import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "FinFlow AI — Your Trusted Finance News & Insights",
    template: "%s | FinFlow AI",
  },
  description:
    "Stay ahead of markets with AI-powered finance news, investing insights, insurance guides, and loan comparisons. Built for Tier-1 readers.",
  keywords: [
    "finance news",
    "investing",
    "stock market",
    "insurance",
    "loans",
    "cryptocurrency",
    "personal finance",
    "financial planning",
  ],
  authors: [{ name: "FinFlow AI Editorial Team" }],
  creator: "FinFlow AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai",
    siteName: "FinFlow AI",
    title: "FinFlow AI — Your Trusted Finance News & Insights",
    description:
      "AI-powered finance news, market analysis, and investment guidance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinFlow AI — Finance News & Insights",
    description: "AI-powered finance news and market analysis.",
    creator: "@finflowai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
