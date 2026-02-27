"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdBanner from "./AdBanner";

export default function AnchorAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-lg p-2">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-1 right-1 p-1 text-slate-400 hover:text-slate-600 rounded"
        aria-label="Close ad"
      >
        <X className="w-3 h-3" />
      </button>
      <AdBanner
        slot="ANCHOR_SLOT_ID"
        format="auto"
        label=""
        style={{ minHeight: 50 }}
      />
    </div>
  );
}
