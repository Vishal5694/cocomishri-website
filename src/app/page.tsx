import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Eye, RotateCcw, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandImage } from "@/components/ui/BrandImage";
import { HeroImage } from "@/components/home/HeroImage";
import { Carousel } from "@/components/ui/Carousel";
import { Section } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { mockProducts } from "@/lib/mock/products";
import { siteConfig } from "@/lib/site-config";
import type { ImageKey } from "@/lib/images";

export const metadata: Metadata = {
  title: "Cocomishri — Sweet like Mishri. Soft like a hug.",
  description:
    "Soft, comfortable kidswear for little moments, made under our own watch. Free shipping on all prepaid orders.",
};

const occasions = [
  {
    title: "Naming ceremony",
    href: "/collections/naming-ceremony",
    imageKey: "occasion-naming-ceremony" as ImageKey,
  },
  {
    title: "First birthday",
    href: "/collections/first-birthday",
    imageKey: "occasion-first-birthday" as ImageKey,
  },
  {
    title: "Festive",
    href: "/collections/festive",
    imageKey: "occasion-festive" as ImageKey,
  },
  {
    title: "Everyday comfort",
    href: "/collections/everyday-comfort",
    imageKey: "occasion-everyday-comfort" as ImageKey,
  },
];

const ageSlugMap: Record<string, string> = {
  "0–6M": "age-0-6m",
  "6–12M": "age-6-12m",
  "1–2Y": "age-1-2y",
  "2–4Y": "age-2-4y",
  "4–6Y": "age-4-6y",
  "6–8Y": "age-6-8y",
  "8–12Y": "age-8-12y",
};

const instagramKeys: ImageKey[] = [
  "instagram-1",
  "instagram-2",
  "instagram-3",
  "instagram-4",
  "instagram-5",
  "instagram-6",
  "instagram-7",
  "instagram-8",
  "instagram-9",
  "instagram-10",
];

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 2.1 Hero (full width, no container, exactly ONE h1) */}
      <Section noContainer bg="transparent" className="relative w-full">
        <div data-transparent-header>
          <HeroImage />
        </div>

        {/* Single Text Card: aligned with Container x-start on desktop, overlapping by 32px on mobile */}
        <div className="-mt-8 mx-4 lg:mt-0 lg:mx-0 lg:absolute lg:bottom-12 lg:left-[max(2rem,calc((100vw-72rem)/2+2rem))] z-10 bg-cream-50 rounded-card p-4 sm:p-8 lg:p-10 max-w-[520px] lg:max-w-[580px] shadow-lg relative">
          <h1 className="leading-tight font-heading font-medium text-cocoa-900">
            A Little World Called Cocomishri
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-cocoa-700 mt-2 sm:mt-3 lg:mt-4 leading-relaxed">
            Because childhood deserves its own little magic.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-6 lg:mt-8">
            <Link href="/shop">
              <Button variant="primary">Shop the collection</Button>
            </Link>
            <Link href="/our-story">
              <Button variant="secondary">Read our story</Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* 2.2 New in — product carousel (bg cream-50) */}
      <Section bg="cream-50">
        <Carousel
          itemCount={mockProducts.length}
          trackLabel="New in products"
          prevLabel="Previous products"
          nextLabel="Next products"
          headerSlot={
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900">
                New in
              </h2>
              <Link href="/shop" className="inline-block">
                <Button variant="secondary" size="sm">
                  Shop now &rarr;
                </Button>
              </Link>
            </div>
          }
        >
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="w-[72vw] sm:w-[260px] lg:w-[260px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </Carousel>
      </Section>

      {/* 2.3 Shop by occasion — grid on desktop (>=1024px), swipe carousel on mobile (<1024px) */}
      <Section bg="cream-50">
        {/* Desktop View (>=1024px): Plain 4-column grid, no arrows, no dots, 24px gap */}
        <div className="hidden lg:block space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900">
            Shop by occasion
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {occasions.map((occasion) => (
              <div key={occasion.href} className="space-y-3">
                <Link
                  href={occasion.href}
                  className="group block rounded-[24px] overflow-hidden focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                >
                  <BrandImage
                    imageKey={occasion.imageKey}
                    ratioOverride="3/4"
                    sizes="(min-width: 1024px) 25vw, 80vw"
                    className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-medium text-cocoa-900">
                    {occasion.title}
                  </h3>
                  <Link href={occasion.href} className="inline-block">
                    <Button variant="secondary" size="sm">
                      Shop now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View (<1024px): Swipe carousel using shared Carousel (tile width 80vw) */}
        <div className="lg:hidden">
          <Carousel
            itemCount={occasions.length}
            trackLabel="Shop by occasion"
            prevLabel="Previous occasions"
            nextLabel="Next occasions"
            headerSlot={
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900">
                  Shop by occasion
                </h2>
              </div>
            }
          >
            {occasions.map((occasion) => (
              <div
                key={occasion.href}
                className="w-[80vw] shrink-0 snap-start space-y-3"
              >
                <Link
                  href={occasion.href}
                  className="group block rounded-[24px] overflow-hidden focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                >
                  <BrandImage
                    imageKey={occasion.imageKey}
                    ratioOverride="3/4"
                    sizes="(min-width: 1024px) 25vw, 80vw"
                    className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </Link>
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-medium text-cocoa-900">
                    {occasion.title}
                  </h3>
                  <Link href={occasion.href} className="inline-block">
                    <Button variant="secondary" size="sm">
                      Shop now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </Section>

      {/* 2.4 Gifting — split block (bg sand-100) */}
      <Section bg="sand-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Mobile: image first, Desktop: image right */}
          <div className="order-1 lg:order-2">
            <BrandImage
              imageKey="gifting"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm"
            />
          </div>

          {/* Mobile: text below, Desktop: text left */}
          <div className="order-2 lg:order-1 max-w-[440px] mx-auto text-center space-y-4 flex flex-col justify-center">
            <span className="eyebrow block">Gift Shop</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
              Gifts for little celebrations
            </h2>
            <p className="text-base text-cocoa-700 leading-relaxed">
              Outfits for naming ceremonies, first birthdays and baby showers. Soft, comfortable and made under our own watch.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/collections/gifts-naming-ceremony">
                <Button variant="secondary" size="sm">
                  Naming ceremony gifts
                </Button>
              </Link>
              <Link href="/collections/gifts-baby-shower">
                <Button variant="secondary" size="sm">
                  Baby shower gifts
                </Button>
              </Link>
              <Link href="/gifting">
                <Button variant="secondary" size="sm">
                  Shop the gift guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 2.5 Shop by age (bg cream-50) */}
      <Section bg="cream-50">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 text-left">
            Shop by age
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            {siteConfig.ageGroups.map((age) => {
              const slug = ageSlugMap[age] || "shop";
              return (
                <Link
                  key={age}
                  href={`/collections/${slug}`}
                  className="min-h-[48px] h-12 px-6 rounded-pill border border-sand-300 text-cocoa-900 hover:bg-blush-100 hover:border-blush-500 inline-flex items-center justify-center text-sm sm:text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 select-none"
                >
                  {age}
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 2.6 Story teaser (bg blush-100) */}
      <Section bg="blush-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <BrandImage
              imageKey="story"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm"
            />
          </div>

          <div className="space-y-4 max-w-lg flex flex-col justify-center">
            <span className="eyebrow block">Our story</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
              Named after our little Mishri
            </h2>
            <p className="text-base sm:text-lg text-cocoa-700 leading-relaxed">
              Named after our daughter, our little Mishri, Cocomishri began with a simple wish: soft, beautiful clothes for her special day, without the scratchy shimmer or the unfair price tag. Today, every piece is made under our own watch, with the same love we have for her.
            </p>
            <div className="pt-2">
              <Link
                href="/our-story"
                className="min-h-[44px] inline-flex items-center text-base font-semibold text-cocoa-900 hover:text-blush-700 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 rounded-pill"
              >
                Read our story &rarr;
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 2.7 Why Cocomishri (bg cream-50) */}
      <Section bg="cream-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <BrandImage
              imageKey="why-cocomishri"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm"
            />
          </div>

          <div className="space-y-6 max-w-xl lg:max-w-none flex flex-col justify-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
                Why Cocomishri
              </h2>
              <p className="text-base text-cocoa-700 mt-3 leading-relaxed">
                Every piece is made under our own watch. We ask one question each time: would we put this on our Mishri?
              </p>
            </div>

            {/* 4 Items: ONE row of 4 on desktop (>=1024px), 2x2 below */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              <div className="space-y-2">
                <Truck className="size-8 text-caramel-700 shrink-0" strokeWidth={1.5} />
                <p className="text-sm font-medium text-cocoa-900 leading-snug">
                  Free shipping on prepaid
                </p>
              </div>

              <div className="space-y-2">
                <Eye className="size-8 text-caramel-700 shrink-0" strokeWidth={1.5} />
                <p className="text-sm font-medium text-cocoa-900 leading-snug">
                  Made under our own watch
                </p>
              </div>

              <div className="space-y-2">
                <RotateCcw className="size-8 text-caramel-700 shrink-0" strokeWidth={1.5} />
                <p className="text-sm font-medium text-cocoa-900 leading-snug">
                  Easy {siteConfig.returns.windowDays}-day returns
                </p>
              </div>

              <div className="space-y-2">
                <Feather className="size-8 text-caramel-700 shrink-0" strokeWidth={1.5} />
                <p className="text-sm font-medium text-cocoa-900 leading-snug">
                  Gentle on little skin
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link href="/our-story">
                <Button variant="secondary">Our story</Button>
              </Link>
              <Link href="/shipping">
                <Button variant="secondary">Shipping & returns</Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* 2.8 Instagram grid (bg cream-50) */}
      <Section bg="cream-50">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900">
            Follow our little world
          </h2>
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center justify-center text-base font-semibold text-blush-700 hover:underline focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 rounded-pill px-2"
          >
            {siteConfig.instagram.handle} on Instagram
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {instagramKeys.map((key) => (
            <a
              key={key}
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on Instagram"
              className="group block rounded-[24px] overflow-hidden focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 transition-transform"
            >
              <BrandImage
                imageKey={key}
                ratioOverride="1/1"
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="w-full transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
