import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDateShort(date);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "…";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function estimateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200); // 200 wpm average
}

export const CATEGORIES = [
  "All",
  "Markets",
  "Investing",
  "Insurance",
  "Loans",
  "Crypto",
  "Economy",
  "Personal Finance",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Markets: "bg-blue-100 text-blue-700",
  Investing: "bg-emerald-100 text-emerald-700",
  Insurance: "bg-purple-100 text-purple-700",
  Loans: "bg-orange-100 text-orange-700",
  Crypto: "bg-yellow-100 text-yellow-700",
  Economy: "bg-slate-100 text-slate-700",
  "Personal Finance": "bg-rose-100 text-rose-700",
};
