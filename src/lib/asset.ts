/**
 * Base path helper for local static assets (logos, icons, images, etc.).
 * Exports asset(path) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`.
 */
export function asset(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!basePath) return path;
  if (path.startsWith(basePath)) return path;
  return `${basePath}${path}`;
}
