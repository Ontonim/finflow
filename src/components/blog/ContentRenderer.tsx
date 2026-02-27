import AdBanner from "@/components/ads/AdBanner";

interface ContentRendererProps {
  content: string; // Raw HTML
}

export default function ContentRenderer({ content }: ContentRendererProps) {
  // Inject ad after the 4th </p> occurrence
  const INJECT_AFTER = 4;
  let count = 0;
  let injected = false;

  const adHtml = `
    <div class="my-8 py-2" data-ad-slot="mid-article">
      <p class="text-center text-xs text-slate-400 mb-2 uppercase tracking-wider" style="font-family:'Inter',sans-serif">Advertisement</p>
      <div class="ad-slot rounded-lg" style="min-height:280px; background:#F1F5F9; border:1px dashed #CBD5E1; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-size:0.7rem; font-family:'Inter',sans-serif; text-transform:uppercase; letter-spacing:0.05em;">
        In-Article Ad — 300×250
      </div>
    </div>
  `;

  const injectedContent = content.replace(/<\/p>/g, (match) => {
    count++;
    if (count === INJECT_AFTER && !injected) {
      injected = true;
      return `</p>${adHtml}`;
    }
    return match;
  });

  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: injectedContent }}
    />
  );
}
