import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BrandImage } from "@/components/ui/BrandImage";
import { formatINR } from "@/lib/site-config";
import type { Product } from "@/lib/mock/products";
import type { ImageKey } from "@/lib/images";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const priceDisplay =
    product.price !== null ? formatINR(product.price) : "₹ —";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block rounded-[24px] focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 transition-transform duration-200",
        className
      )}
    >
      <div className="relative">
        <BrandImage
          imageKey={product.imageKey as ImageKey | null}
          ratioOverride="4/5"
          altOverride={product.name}
          captionOverride="Photo: product"
          sizes="(min-width: 1024px) 260px, 72vw"
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {product.badge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <Badge variant="new">{product.badge}</Badge>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-heading text-[18px] font-medium text-cocoa-900 group-hover:text-blush-700 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm font-sans text-cocoa-700">{priceDisplay}</p>
      </div>
    </Link>
  );
}
