export interface SocialLinks {
  instagram: {
    handle: string;
    url: string;
  };
  facebook?: {
    url: string;
  };
  pinterest?: {
    url: string;
  };
  youtube?: {
    url: string;
  };
}

export interface SiteConfig {
  name: string;
  domain: string;
  tagline: string;
  logoTagline: string;
  email: string;
  instagram: {
    handle: string;
    url: string;
  };
  social: SocialLinks;
  phone: string;
  whatsapp: string;
  legal: {
    entityName: string;
    gstin: string;
    address: string;
  };
  shipping: {
    prepaidFree: boolean;
    codFee: number;
    codMaxOrderValue: number;
  };
  returns: {
    windowDays: number;
    reviewTimeText: string;
  };
  ageGroups: readonly string[];
  announcements: readonly string[];
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}

const shippingConfig = {
  prepaidFree: true,
  codFee: 99,
  codMaxOrderValue: 1999,
};

const returnsConfig = {
  windowDays: 7,
  reviewTimeText: "within 24–48 hours",
};

export const siteConfig: SiteConfig = {
  name: "Cocomishri",
  domain: "cocomishri.com",
  tagline: "Sweet like Mishri. Soft like a hug.",
  logoTagline: "Where little dreams wear love",
  email: "care@cocomishri.com",
  instagram: {
    handle: "@cocomishri",
    url: "https://instagram.com/cocomishri",
  },
  social: {
    instagram: {
      handle: "@cocomishri",
      url: "https://instagram.com/cocomishri",
    },
  },
  phone: "PLACEHOLDER_PHONE",
  whatsapp: "PLACEHOLDER_WHATSAPP",
  legal: {
    entityName: "PLACEHOLDER_LEGAL_ENTITY",
    gstin: "PLACEHOLDER_GSTIN",
    address: "PLACEHOLDER_FULL_ADDRESS",
  },
  shipping: shippingConfig,
  returns: returnsConfig,
  ageGroups: ["0–6M", "6–12M", "1–2Y", "2–4Y", "4–6Y", "6–8Y", "8–12Y"] as const,
  announcements: [
    "Free shipping on all prepaid orders",
    `Easy ${returnsConfig.windowDays}-day returns and exchanges`,
    `Cash on delivery available on orders up to ${formatINR(shippingConfig.codMaxOrderValue)}`,
  ] as const,
};
