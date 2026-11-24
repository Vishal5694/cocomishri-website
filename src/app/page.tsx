import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import {
  BrandImage,
  Carousel,
  CampaignTitle,
  TextLink,
  Sparkle,
} from "@/components/ui";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { HeroSlider, type HeroSlideData } from "@/components/home/HeroSlider";
import { images, type ImageEntry, type ImageKey } from "@/lib/images";
import { mockProducts } from "@/lib/mock/products";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Cocomishri — Sweet like Mishri. Soft like a hug.",
  description:
    "Soft, comfortable kidswear for little moments, made under our own watch. Free shipping on all prepaid orders.",
};

function resolveSrc(entry: ImageEntry): string | null {
  const isDev = process.env.NODE_ENV !== "production";
  const showSample =
    isDev || process.env.NEXT_PUBLIC_SHOW_SAMPLE_IMAGES === "true";
  return entry.src || (showSample ? entry.sampleSrc : null);
}

function buildArtDirectedProps(
  desktopKey: ImageKey,
  mobileKey: ImageKey,
  priority: boolean
) {
  const desktopEntry = images[desktopKey] as ImageEntry;
  const mobileEntry = images[mobileKey] as ImageEntry;
  const desktopSrc = resolveSrc(desktopEntry);
  const mobileSrc = resolveSrc(mobileEntry);

  if (!desktopSrc || !mobileSrc) {
    return {
      desktopSrcSet: undefined,
      mobileSrcSet: undefined,
      fallbackSrc: undefined,
      alt: desktopEntry.alt,
      desktopPosition: desktopEntry.position,
      mobilePosition: mobileEntry.position,
      shot: desktopEntry.shot,
    };
  }

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    src: desktopSrc,
    alt: desktopEntry.alt,
    fill: true,
    priority,
    sizes: "100vw",
  });

  const {
    props: { srcSet: mobileSrcSet, src: fallbackSrc },
  } = getImageProps({
    src: mobileSrc,
    alt: mobileEntry.alt,
    fill: true,
    priority,
    sizes: "100vw",
  });

  return {
    desktopSrcSet,
    mobileSrcSet,
    fallbackSrc,
    alt: desktopEntry.alt,
    desktopPosition: desktopEntry.position,
    mobilePosition: mobileEntry.position,
    shot: desktopEntry.shot,
  };
}

const namingCeremonyGrid: {
  imageKey: ImageKey;
  label: string;
  href: string;
}[] = [
  {
    imageKey: "occasion-naming-ceremony",
    label: "BABY GIRLS",
    href: "/collections/baby-girls",
  },
  {
    imageKey: "product-1",
    label: "BABY BOYS",
    href: "/collections/baby-boys",
  },
  {
    imageKey: "product-2",
    label: "SETS",
    href: "/collections/baby-girls-sets",
  },
  {
    imageKey: "gifting",
    label: "GIFTS",
    href: "/collections/gifts-naming-ceremony",
  },
];

const occasionTiles: {
  imageKey: ImageKey;
  label: string;
  href: string;
}[] = [
  {
    imageKey: "occasion-naming-ceremony",
    label: "NAMING CEREMONY",
    href: "/collections/naming-ceremony",
  },
  {
    imageKey: "occasion-first-birthday",
    label: "FIRST BIRTHDAY",
    href: "/collections/first-birthday",
  },
  {
    imageKey: "occasion-festive",
    label: "FESTIVE",
    href: "/collections/festive",
  },
  {
    imageKey: "occasion-everyday-comfort",
    label: "EVERYDAY COMFORT",
    href: "/collections/everyday-comfort",
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
];

export default function HomePage() {
  const slides: HeroSlideData[] = [
    {
      id: "slide-1",
      title: "Sweet like Mishri. Soft like a hug.",
      links: [
        { label: "SHOP NEW IN", href: "/collections/baby-new-in" },
        { label: "OUR STORY", href: "/our-story" },
      ],
      ...buildArtDirectedProps("hero-desktop", "hero-mobile", true),
    },
    {
      id: "slide-2",
      title: "Made for little moments. Loved for a lifetime.",
      links: [
        { label: "SHOP NAMING CEREMONY", href: "/collections/naming-ceremony" },
      ],
      ...buildArtDirectedProps("v2-slide-2", "occasion-naming-ceremony", false),
    },
    {
      id: "slide-3",
      title: "Where little dreams wear love",
      links: [{ label: "SHOP FESTIVE", href: "/collections/festive" }],
      ...buildArtDirectedProps("v2-slide-3", "occasion-festive", false),
    },
  ];

  const bannerArt = buildArtDirectedProps("v2-banner-1", "story", false);

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1) HERO SLIDER */}
      <HeroSlider slides={slides} />

      {/* 2) CAMPAIGN BANNER */}
      <section className="relative w-full h-[70vh] lg:h-[80vh] overflow-hidden bg-caramel-100">
        {bannerArt.fallbackSrc ? (
          <picture className="w-full h-full block">
            {bannerArt.desktopSrcSet && (
              <source
                media="(min-width: 1024px)"
                srcSet={bannerArt.desktopSrcSet}
              />
            )}
            {bannerArt.mobileSrcSet && (
              <source
                media="(max-width: 1023px)"
                srcSet={bannerArt.mobileSrcSet}
              />
            )}
            <img
              src={bannerArt.fallbackSrc}
              alt={bannerArt.alt}
              sizes="100vw"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: bannerArt.desktopPosition || "center" }}
            />
          </picture>
        ) : (
          <div
            role="img"
            aria-label={bannerArt.alt}
            className="w-full h-full bg-caramel-100 flex items-center justify-center p-6 text-cocoa-700 text-sm"
          >
            {bannerArt.shot && <span>Photo: {bannerArt.shot}</span>}
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-cocoa-900/55 via-cocoa-900/20 to-transparent pointer-events-none"
        />

        <div className="absolute inset-x-0 bottom-12 sm:bottom-16 z-10 px-4 sm:px-6 text-center flex flex-col items-center">
          <div className="max-w-3xl space-y-4">
            <CampaignTitle as="h2" className="text-cream-50">
              Because childhood deserves its own little magic.
            </CampaignTitle>
            <TextLink href="/collections/baby-toddler" variant="cream">
              SHOP BABY + TODDLER
            </TextLink>
          </div>
        </div>
      </section>

      {/* 3) NEW IN — bg cream-50 */}
      <section className="w-full bg-cream-50 py-14 lg:py-20">
        <Container>
          <Carousel
            itemCount={mockProducts.length}
            trackLabel="New in products"
            prevLabel="Previous products"
            nextLabel="Next products"
            headerSlot={
              <div className="space-y-2">
                <span className="eyebrow block">New in</span>
                <CampaignTitle as="h2" className="text-cocoa-900">
                  Made for little moments
                </CampaignTitle>
                <div>
                  <TextLink href="/shop" variant="dark" className="px-0">
                    SHOP ALL
                  </TextLink>
                </div>
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
        </Container>
      </section>

      {/* 4) EDITORIAL PAIR — Soft like a hug */}
      <section className="w-full bg-sand-100 py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <CampaignTitle as="h2" className="text-cocoa-900 text-center">
            Soft like a hug
          </CampaignTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="flex flex-col items-center space-y-4">
              <BrandImage
                imageKey="product-6"
                ratioOverride="4/5"
                sizes="(min-width: 1024px) 448px, 100vw"
                className="w-full lg:max-w-[448px] lg:max-h-[560px]"
              />
              <TextLink href="/collections/girls" variant="dark">
                SHOP GIRLS
              </TextLink>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <BrandImage
                imageKey="product-7"
                ratioOverride="4/5"
                sizes="(min-width: 1024px) 448px, 100vw"
                className="w-full lg:max-w-[448px] lg:max-h-[560px]"
              />
              <TextLink href="/collections/baby-girls" variant="dark">
                SHOP BABY GIRLS
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* 5) COCOA BLOCK — Naming ceremony */}
      <section className="relative w-full bg-cocoa-900 text-cream-50 py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Sparkle
          aria-hidden="true"
          className="size-6 text-amber-500 absolute top-6 left-6 pointer-events-none"
        />
        <Sparkle
          aria-hidden="true"
          className="size-6 text-amber-500 absolute bottom-6 right-6 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-caramel-100 block">
              NAMING CEREMONY
            </span>
            <CampaignTitle as="h2" className="text-cream-50">
              An outfit as soft and pure as she was
            </CampaignTitle>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {namingCeremonyGrid.map((item) => (
              <div
                key={item.href}
                className="flex flex-col items-center space-y-3"
              >
                <BrandImage
                  imageKey={item.imageKey}
                  ratioOverride="3/4"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="w-full lg:max-h-[420px]"
                />
                <TextLink href={item.href} variant="cream">
                  {item.label}
                </TextLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6) SAGE BLOCK — Shop by occasion */}
      <section className="w-full bg-sage-700 text-cream-50 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <CampaignTitle as="h2" className="text-cream-50 text-center">
            Shop by occasion
          </CampaignTitle>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {occasionTiles.map((tile) => (
              <div
                key={tile.href}
                className="flex flex-col items-center space-y-3"
              >
                <BrandImage
                  imageKey={tile.imageKey}
                  ratioOverride="3/4"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="w-full"
                />
                <TextLink href={tile.href} variant="cream">
                  {tile.label}
                </TextLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7) CARAMEL BLOCK — Shop by age (no eyebrow) */}
      <section className="w-full bg-caramel-700 text-cream-50 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          <CampaignTitle as="h2" className="text-cream-50">
            Shop by age
          </CampaignTitle>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {siteConfig.ageGroups.map((age) => {
              const slug = ageSlugMap[age] || "shop";
              return (
                <Link
                  key={age}
                  href={`/collections/${slug}`}
                  className="h-12 min-h-[48px] px-6 rounded-pill border-[1.5px] border-cream-50 text-cream-50 hover:bg-cream-50 hover:text-cocoa-900 inline-flex items-center justify-center text-sm sm:text-base font-semibold transition-colors duration-300 ease-soft focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2 select-none"
                >
                  {age}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8) GIFTING */}
      <section className="w-full bg-cream-50 py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <CampaignTitle as="h2" className="text-cocoa-900 text-center">
            Gifts for little celebrations
          </CampaignTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card A */}
            <div className="bg-blush-700 text-cream-50 rounded-card p-6 sm:p-8 flex flex-col items-center justify-between space-y-6">
              <BrandImage
                imageKey="gifting"
                ratioOverride="4/5"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full"
              />
              <TextLink href="/gifting" variant="cream">
                SHOP THE GIFT GUIDE
              </TextLink>
            </div>

            {/* Card B */}
            <div className="bg-sand-100 text-cocoa-900 rounded-card p-6 sm:p-8 flex flex-col items-center justify-between space-y-6 text-center">
              <BrandImage
                imageKey="story-ch1"
                ratioOverride="4/5"
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="w-full"
              />
              <div className="space-y-4 max-w-sm">
                <p className="font-heading text-[22px] leading-snug text-cocoa-900">
                  Not sure what to choose? Write to us and we&apos;ll help.
                </p>
                <TextLink href="/contact" variant="dark">
                  CONTACT US
                </TextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9) STORY BLOCK */}
      <section className="relative w-full py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cocoa-900">
        <div className="absolute inset-0">
          <BrandImage
            imageKey="story-ch3"
            ratioOverride="auto"
            sizes="100vw"
            className="w-full h-full rounded-none"
            style={{ aspectRatio: "auto", height: "100%", width: "100%" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cocoa-900/55 pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-cream-50 p-4 rounded-card shadow-lg">
            <BrandImage
              imageKey="story-ch2"
              ratioOverride="4/5"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="w-full"
            />
          </div>

          <div className="bg-cream-50 text-cocoa-900 rounded-card p-8 lg:p-12 shadow-lg space-y-5">
            <span className="eyebrow block">
              A note from Mishri&apos;s parents
            </span>
            <CampaignTitle as="h2" className="text-cocoa-900">
              Made before our own eyes
            </CampaignTitle>
            <blockquote className="font-heading italic text-2xl leading-snug text-cocoa-900">
              &ldquo;Would we put this on our Mishri?&rdquo;
            </blockquote>
            <p className="text-base text-cocoa-700 leading-relaxed">
              We ask this one question each time. If the answer isn&apos;t a
              happy yes, it doesn&apos;t reach you.
            </p>
            <div className="pt-1">
              <TextLink href="/our-story" variant="dark" className="px-0">
                READ OUR STORY
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* 10) INSTAGRAM STRIP */}
      <section className="w-full bg-cream-50 pt-16 lg:pt-20">
        <div className="text-center space-y-2 px-4 mb-10">
          <CampaignTitle as="h2" className="text-cocoa-900">
            Follow our little world
          </CampaignTitle>
          <TextLink
            href={siteConfig.instagram.url}
            variant="dark"
            external
          >
            {siteConfig.instagram.handle}
          </TextLink>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-0 w-full">
          {instagramKeys.map((key) => (
            <a
              key={key}
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on Instagram"
              className="block overflow-hidden focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <BrandImage
                imageKey={key}
                ratioOverride="1/1"
                sizes="(min-width: 1024px) 17vw, 33vw"
                className="w-full rounded-none"
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
