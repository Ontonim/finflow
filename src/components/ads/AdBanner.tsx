"use client";

import { useEffect } from "react";
import Script from "next/script";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical";
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
  label = "Advertisement",
  style,
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  return (
    <div className={`${className} relative`}>
      <p className="text-center text-xs text-slate-400 mb-1 uppercase tracking-wider">
        {label}
      </p>
      {publisherId ? (
        <>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
          <ins
            className="adsbygoogle"
            style={{ display: "block", ...style }}
            data-ad-client={publisherId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </>
      ) : (
        /* Dev placeholder */
        <div
          className="ad-slot rounded-lg flex items-center justify-center text-slate-400 text-xs"
          style={style || { minHeight: 90 }}
        >
          Ad Slot — {slot}
        </div>
      )}
    </div>
  );
}
