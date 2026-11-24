import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center space-y-8">
          <span className="eyebrow">Search</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-cocoa-900">
            Search
          </h1>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
