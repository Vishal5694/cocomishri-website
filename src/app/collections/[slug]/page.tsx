import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { allCollectionSlugs, collectionTitle } from "@/lib/navigation";

export function generateStaticParams() {
  return allCollectionSlugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = collectionTitle(slug);
  return {
    title: collection.title,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  if (!allCollectionSlugs.includes(slug)) {
    notFound();
  }

  const collection = collectionTitle(slug);
  return <ComingSoon title={collection.title} eyebrow={collection.eyebrow} />;
}
