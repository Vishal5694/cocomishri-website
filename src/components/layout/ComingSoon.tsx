import { Button } from "@/components/ui";

interface ComingSoonProps {
  title: string;
  eyebrow?: string;
}

export function ComingSoon({
  title,
  eyebrow = "Coming Soon",
}: ComingSoonProps) {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-cream-50">
      <span className="eyebrow mb-3">{eyebrow}</span>
      <h1 className="mb-4">{title}</h1>
      <p className="mb-8 text-cocoa-700 max-w-md">This page is coming soon.</p>
      <Button variant="secondary" size="md" href="/">
        Back to home
      </Button>
    </section>
  );
}
