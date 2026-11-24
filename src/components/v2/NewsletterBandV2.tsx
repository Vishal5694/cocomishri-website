"use client";

import * as React from "react";
import { Button, Input } from "@/components/ui";
import { asset } from "@/lib/asset";
import { CampaignTitle } from "./CampaignTitle";

export function NewsletterBandV2() {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <section className="w-full bg-sand-100 py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Mascot (96px) */}
        <img
          src={asset("/brand/mascot.svg")}
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          loading="lazy"
          className="size-24 object-contain shrink-0"
        />

        {/* Centred Title + Form */}
        <div className="w-full max-w-md text-center space-y-5">
          <CampaignTitle as="h2" className="text-cocoa-900">
            Join our little world
          </CampaignTitle>

          {isSubscribed ? (
            <div className="bg-cream-50 border border-sand-300 rounded-card p-4 text-sm text-cocoa-900">
              Thank you for joining our little world. We&apos;ll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left" noValidate>
              <Input
                type="email"
                label="Email address"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                error={emailError}
                className="bg-cream-50"
              />
              <Button type="submit" variant="primary" size="md" className="w-full">
                Sign me up
              </Button>
            </form>
          )}
        </div>

        {/* Right Mascot (96px, hidden on mobile) */}
        <img
          src={asset("/brand/mascot.svg")}
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          loading="lazy"
          className="hidden md:block size-24 object-contain shrink-0"
        />
      </div>
    </section>
  );
}
