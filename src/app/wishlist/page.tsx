import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Your wishlist",
};

export default function WishlistPage() {
  return (
    <div className="w-full py-16 lg:py-24">
      <Container className="flex flex-col items-center text-center space-y-5">
        <h1 className="font-heading text-[36px] lg:text-[48px] leading-[1.2] font-medium text-cocoa-900">
          Your wishlist
        </h1>
        <p className="text-base text-cocoa-700 max-w-md">
          Tap the heart on any piece to save it here.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary">Continue shopping</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
