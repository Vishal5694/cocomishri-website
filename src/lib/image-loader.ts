// When we move to Vercel, local images can use the default Next.js optimizer.
import { asset } from "./asset";

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    const base = src.split("?")[0];
    return `${base}?auto=format&fit=crop&w=${width}&q=${quality ?? 70}`;
  }
  return asset(src);
}
