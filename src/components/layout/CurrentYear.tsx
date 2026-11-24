"use client";

import * as React from "react";

function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}

export function CurrentYear() {
  return (
    <React.Suspense fallback={<span suppressHydrationWarning />}>
      <Year />
    </React.Suspense>
  );
}
