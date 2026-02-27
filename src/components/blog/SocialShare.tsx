"use client";

import { useState } from "react";
import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";

interface SocialShareProps {
  title: string;
  slug: string;
}

export default function SocialShare({ title, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://finflow.ai";
  const url = `${baseUrl}/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
      label: "Share on X",
      color: "hover:bg-slate-900 hover:text-white",
    },
    {
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      label: "Share on LinkedIn",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      label: "Share on Facebook",
      color: "hover:bg-blue-800 hover:text-white",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      {shareLinks.map(({ icon: Icon, href, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 transition-all duration-200 shadow-sm ${color}`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm ${
          copied
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "bg-white border-slate-200 text-slate-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
        }`}
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
