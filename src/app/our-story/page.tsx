import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { BrandImage } from "@/components/ui/BrandImage";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@/components/ui/sparkle";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Cocomishri is named after our daughter, our little Mishri. Soft, comfortable kidswear made under our own watch, at prices that are fair for families.",
};

export default function OurStoryPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Page Header (bg cream-50) */}
      <Section bg="cream-50" className="pt-12 lg:pt-16 pb-12 lg:pb-16">
        <div className="max-w-[720px] mx-auto text-center space-y-4">
          <span className="eyebrow block">Our story</span>
          <h1 className="leading-tight font-heading font-medium text-cocoa-900">
            A Little World Called Cocomishri
          </h1>
          <p className="font-heading italic text-[22px] leading-snug text-cocoa-700 mt-4">
            Born from a parent&apos;s love. Made for every little one.
          </p>
        </div>

        {/* story-hero BrandImage */}
        <div className="mt-10 lg:mt-12 w-full">
          <BrandImage
            imageKey="story-hero"
            priority
            sizes="(min-width: 1024px) 1088px, 100vw"
            className="w-full shadow-sm rounded-[24px]"
          />
        </div>

        {/* 2. Chapter navigation (desktop only, >=1024px) */}
        <nav
          aria-label="Chapters"
          className="hidden lg:flex items-center justify-center gap-8 mt-10 border-t border-sand-300 pt-6"
        >
          <a
            href="#it-all-began-with-her"
            className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            It all began with her
          </a>
          <a
            href="#our-little-mishri"
            className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            Our little Mishri
          </a>
          <a
            href="#made-under-our-watch"
            className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            Made before our own eyes
          </a>
          <a
            href="#softness-you-can-feel"
            className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            Softness you can feel
          </a>
          <a
            href="#our-promise"
            className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            Our promise
          </a>
        </nav>
      </Section>

      {/* Chapter 1 — id "it-all-began-with-her" — image story-ch1 (image RIGHT on desktop) */}
      <Section
        id="it-all-began-with-her"
        bg="blush-100"
        className="scroll-mt-[100px] lg:scroll-mt-[120px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text column (desktop LEFT, mobile SECOND) */}
          <div className="order-2 lg:order-1 max-w-[560px] space-y-4">
            <div>
              <span className="eyebrow block mb-2">Chapter 1</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
                It All Began With Her
              </h2>
            </div>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              Every brand has a beginning. Ours began with a tiny heartbeat and a whole new world.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              When our daughter Adira came into our lives, everything changed. Our days got busier, our nights got shorter, and our hearts got fuller than we thought possible.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              As her naming ceremony came closer, we wanted one simple thing for her: an outfit as soft and pure as she was. It had to be something she could wear comfortably in our arms, through all the blessings, hugs and photographs.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              So we started searching. What we found surprised us. Most of it was shimmery, stiff and scratchy, made to look good in pictures but not to feel good on a baby&apos;s delicate skin. The few outfits that were truly soft and well made cost far more than most families could reasonably pay.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900 italic">
              We kept asking each other: &ldquo;Why should parents have to choose between comfort, quality and a fair price?&rdquo;
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              That question stayed with us long after the ceremony was over. Slowly, it turned into a dream.
            </p>
          </div>

          {/* Image column (desktop RIGHT, mobile FIRST) */}
          <div className="order-1 lg:order-2">
            <BrandImage
              imageKey="story-ch1"
              ratioOverride="4/5"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm rounded-[24px]"
            />
          </div>
        </div>
      </Section>

      {/* Chapter 2 — id "our-little-mishri" — image story-ch2 (image LEFT on desktop) */}
      <Section
        id="our-little-mishri"
        bg="cream-50"
        className="scroll-mt-[100px] lg:scroll-mt-[120px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image column (desktop LEFT, mobile FIRST) */}
          <div className="order-1 lg:order-1">
            <BrandImage
              imageKey="story-ch2"
              ratioOverride="4/5"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm rounded-[24px]"
            />
          </div>

          {/* Text column (desktop RIGHT, mobile SECOND) */}
          <div className="order-2 lg:order-2 max-w-[560px] space-y-4">
            <div>
              <span className="eyebrow block mb-2">Chapter 2</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
                Our Little Mishri
              </h2>
            </div>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              At home, Adira has never been just Adira. She is our <strong>Mishri</strong>.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              Mishri is the little crystal of sugar that Indian homes have always kept close. It&apos;s offered in blessings, shared in celebrations and given to children with love. It&apos;s simple, pure and sweet, and it makes every moment a little better. That&apos;s exactly what she is to us.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              So when our dream became a brand, the name had to carry her. <strong>Cocomishri</strong> was born. It&apos;s our way of keeping the sweetness she brought into our lives at the heart of everything we do.
            </p>
          </div>
        </div>
      </Section>

      {/* Chapter 3 — id "made-under-our-watch" — image story-ch3 (image RIGHT on desktop) */}
      <Section
        id="made-under-our-watch"
        bg="blush-100"
        className="scroll-mt-[100px] lg:scroll-mt-[120px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text column (desktop LEFT, mobile SECOND) */}
          <div className="order-2 lg:order-1 max-w-[560px] space-y-4">
            <div>
              <span className="eyebrow block mb-2">Chapter 3</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
                Made Before Our Own Eyes
              </h2>
            </div>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              Because Cocomishri carries our daughter&apos;s name, we knew we could never treat it like just another business.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              Many manufacturers show beautiful samples, and then quality quietly slips once bulk production begins. We couldn&apos;t let that happen to something named after our child.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              So we chose the harder, slower path. Every Cocomishri outfit is made under our own watch. We check the fabric, the stitching and the finish, and every piece gets the same love and attention as the very first one.
            </p>

            {/* PULL-QUOTE block */}
            <figure className="my-6 border-l-2 border-blush-700 pl-6 rounded-none space-y-2">
              <Sparkle size={16} className="text-amber-500 shrink-0" aria-hidden="true" />
              <blockquote className="font-heading italic text-2xl lg:text-[28px] leading-snug text-cocoa-900">
                &ldquo;Would we put this on our Mishri?&rdquo;
              </blockquote>
            </figure>

            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              We ask this one question each time. If the answer isn&apos;t a happy yes, it doesn&apos;t reach you.
            </p>
          </div>

          {/* Image column (desktop RIGHT, mobile FIRST) */}
          <div className="order-1 lg:order-2">
            <BrandImage
              imageKey="story-ch3"
              ratioOverride="4/5"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm rounded-[24px]"
            />
          </div>
        </div>
      </Section>

      {/* Chapter 4 — id "softness-you-can-feel" — image story-ch4 (image LEFT on desktop) */}
      <Section
        id="softness-you-can-feel"
        bg="cream-50"
        className="scroll-mt-[100px] lg:scroll-mt-[120px]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image column (desktop LEFT, mobile FIRST) */}
          <div className="order-1 lg:order-1">
            <BrandImage
              imageKey="story-ch4"
              ratioOverride="4/5"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="w-full shadow-sm rounded-[24px]"
            />
          </div>

          {/* Text column (desktop RIGHT, mobile SECOND) */}
          <div className="order-2 lg:order-2 max-w-[560px] space-y-4">
            <div>
              <span className="eyebrow block mb-2">Chapter 4</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
                Softness You Can Feel
              </h2>
            </div>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              A baby can&apos;t tell you when something itches. As parents, we&apos;ve learned to read those little signs, and how much comfort really matters.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              That&apos;s why fabric is where every Cocomishri piece begins: smooth, breathable and gentle on delicate skin, so little ones can crawl, play, nap and explore freely.
            </p>
            <p className="text-base lg:text-[17px] leading-[1.7] text-cocoa-900">
              A comfortable child is free to simply be a child.
            </p>
          </div>
        </div>
      </Section>

      {/* Chapter 5 — id "our-promise" — NO image, centred, max-width 640px */}
      <Section
        id="our-promise"
        bg="sand-100"
        className="scroll-mt-[100px] lg:scroll-mt-[120px]"
      >
        <div className="max-w-[640px] mx-auto text-center space-y-4">
          <span className="eyebrow block">Chapter 5</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-cocoa-900 leading-tight">
            Our Promise to You
          </h2>

          {/* List: 4 items left-aligned inside centred container */}
          <div className="max-w-[540px] mx-auto text-left pt-4">
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-lg text-cocoa-900">
                <Sparkle size={16} className="text-amber-500 shrink-0 mt-1" aria-hidden="true" />
                <span>Clothes that feel as good as they look</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-cocoa-900">
                <Sparkle size={16} className="text-amber-500 shrink-0 mt-1" aria-hidden="true" />
                <span>Quality that stays the same, piece after piece</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-cocoa-900">
                <Sparkle size={16} className="text-amber-500 shrink-0 mt-1" aria-hidden="true" />
                <span>Prices that are honest and fair for families</span>
              </li>
              <li className="flex items-start gap-3 text-lg text-cocoa-900">
                <Sparkle size={16} className="text-amber-500 shrink-0 mt-1" aria-hidden="true" />
                <span>In every stitch, the same love we have for our own little one</span>
              </li>
            </ul>
          </div>

          <p className="font-heading italic text-[22px] leading-snug text-cocoa-700 text-center pt-8 pb-4">
            From our family to yours, welcome to Cocomishri.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/shop">
              <Button variant="primary">Shop the collection</Button>
            </Link>
            <Link href="/collections/occasions">
              <Button variant="secondary">Shop occasions</Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
