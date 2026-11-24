import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-cream-50">
      <span className="eyebrow mb-3">404</span>
      <h1 className="mb-4">We couldn&apos;t find that page</h1>
      <p className="mb-8 text-cocoa-700 max-w-md">
        The link you followed may be broken or the page may have been moved.
      </p>
      <Button variant="secondary" size="md" href="/">
        Back to home
      </Button>
    </section>
  );
}
