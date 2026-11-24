export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  groups?: NavGroup[];
}

export function col(label: string, slug: string): NavLink {
  return { label, href: `/collections/${slug}` };
}

export const mainNav: NavItem[] = [
  {
    label: "Baby + Toddler",
    href: "/collections/baby-toddler",
    groups: [
      {
        title: "Shop by age",
        links: [
          col("0–6 months", "age-0-6m"),
          col("6–12 months", "age-6-12m"),
          col("1–2 years", "age-1-2y"),
          col("Shop all baby", "baby-toddler"),
        ],
      },
      {
        title: "New + featured",
        links: [
          col("New in", "baby-new-in"),
          col("Best sellers – Baby girl", "baby-girl-best-sellers"),
          col("Best sellers – Baby boy", "baby-boy-best-sellers"),
          col("Naming ceremony", "naming-ceremony"),
          col("First birthday", "first-birthday"),
          col("Sibling matching", "sibling-matching"),
        ],
      },
      {
        title: "Baby girls",
        links: [
          col("All", "baby-girls"),
          col("Tops", "baby-girls-tops"),
          col("Bottoms", "baby-girls-bottoms"),
          col("One-pieces", "baby-girls-one-pieces"),
          col("Sets", "baby-girls-sets"),
          col("Dresses", "baby-girls-dresses"),
          col("Outerwear", "baby-girls-outerwear"),
          col("Nightwear", "baby-girls-nightwear"),
          col("Accessories", "baby-girls-accessories"),
        ],
      },
      {
        title: "Baby boys",
        links: [
          col("All", "baby-boys"),
          col("Tops", "baby-boys-tops"),
          col("Bottoms", "baby-boys-bottoms"),
          col("One-pieces", "baby-boys-one-pieces"),
          col("Sets", "baby-boys-sets"),
          col("Outerwear", "baby-boys-outerwear"),
          col("Nightwear", "baby-boys-nightwear"),
          col("Accessories", "baby-boys-accessories"),
        ],
      },
    ],
  },
  {
    label: "Girls",
    href: "/collections/girls",
    groups: [
      {
        title: "Shop by age",
        links: [
          col("2–4 years", "girls-2-4y"),
          col("4–6 years", "girls-4-6y"),
          col("6–8 years", "girls-6-8y"),
          col("8–12 years", "girls-8-12y"),
        ],
      },
      {
        title: "New + featured",
        links: [
          col("New in", "girls-new-in"),
          col("Best sellers – Girls", "girls-best-sellers"),
          col("Festive", "festive"),
          col("Sibling matching", "sibling-matching"),
        ],
      },
      {
        title: "Girls",
        links: [
          col("All", "girls"),
          col("Tops", "girls-tops"),
          col("Bottoms", "girls-bottoms"),
          col("Dresses", "girls-dresses"),
          col("Sets", "girls-sets"),
          col("Ethnic wear", "girls-ethnic-wear"),
          col("Outerwear", "girls-outerwear"),
          col("Nightwear", "girls-nightwear"),
          col("Accessories", "girls-accessories"),
        ],
      },
    ],
  },
  {
    label: "Boys",
    href: "/collections/boys",
    groups: [
      {
        title: "Shop by age",
        links: [
          col("2–4 years", "boys-2-4y"),
          col("4–6 years", "boys-4-6y"),
          col("6–8 years", "boys-6-8y"),
          col("8–12 years", "boys-8-12y"),
        ],
      },
      {
        title: "New + featured",
        links: [
          col("New in", "boys-new-in"),
          col("Best sellers – Boys", "boys-best-sellers"),
          col("Festive", "festive"),
          col("Sibling matching", "sibling-matching"),
        ],
      },
      {
        title: "Boys",
        links: [
          col("All", "boys"),
          col("Tops", "boys-tops"),
          col("Bottoms", "boys-bottoms"),
          col("Sets", "boys-sets"),
          col("Ethnic wear", "boys-ethnic-wear"),
          col("Outerwear", "boys-outerwear"),
          col("Nightwear", "boys-nightwear"),
          col("Accessories", "boys-accessories"),
        ],
      },
    ],
  },
  {
    label: "Occasions",
    href: "/collections/occasions",
    groups: [
      {
        title: "Celebrate",
        links: [
          col("Naming ceremony", "naming-ceremony"),
          col("First birthday", "first-birthday"),
          col("Festive", "festive"),
          col("Family functions", "family-functions"),
        ],
      },
      {
        title: "Every day",
        links: [
          col("Everyday comfort", "everyday-comfort"),
          col("Nightwear", "nightwear"),
        ],
      },
    ],
  },
  {
    label: "Gift Shop",
    href: "/gifting",
    groups: [
      {
        title: "Gift guide",
        links: [
          col("Naming ceremony gifts", "gifts-naming-ceremony"),
          col("Baby shower gifts", "gifts-baby-shower"),
          col("Gifts for girls", "gifts-girls"),
          col("Gifts for boys", "gifts-boys"),
        ],
      },
      {
        title: "Gifting",
        links: [{ label: "Gift wrap & notes", href: "/gifting" }],
      },
    ],
  },
  { label: "Our Story", href: "/our-story" },
];

export const supportLinks: NavLink[] = [
  { label: "Help centre", href: "/faq" },
  { label: "Account", href: "/account" },
  { label: "Order tracking", href: "/track-order" },
  { label: "Start a return", href: "/returns/start" },
  { label: "Size guide", href: "/size-guide" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns & exchanges", href: "/returns" },
  { label: "Contact us", href: "/contact" },
];

export const footerLegal: NavLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
  { label: "Shipping policy", href: "/shipping" },
  { label: "Returns policy", href: "/returns" },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "SHOP",
    links: [
      col("Baby + Toddler", "baby-toddler"),
      col("Baby girls", "baby-girls"),
      col("Baby boys", "baby-boys"),
      col("Girls", "girls"),
      col("Boys", "boys"),
      col("Occasions", "occasions"),
      col("New in", "baby-new-in"),
      { label: "Gift shop", href: "/gifting" },
    ],
  },
  {
    title: "ABOUT",
    links: [
      { label: "Our story", href: "/our-story" },
      { label: "Made under our own watch", href: "/our-story#made-under-our-watch" },
      { label: "Fabric & care", href: "/fabric-care" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    title: "SUPPORT",
    links: supportLinks,
  },
];

// Helper to extract every unique collection slug
function extractCollectionSlugs(): string[] {
  const slugs = new Set<string>();

  // Add top-level collection hrefs
  mainNav.forEach((item) => {
    if (item.href.startsWith("/collections/")) {
      slugs.add(item.href.replace("/collections/", ""));
    }
    item.groups?.forEach((group) => {
      group.links.forEach((link) => {
        if (link.href.startsWith("/collections/")) {
          slugs.add(link.href.replace("/collections/", ""));
        }
      });
    });
  });

  footerColumns.forEach((col) => {
    col.links.forEach((link) => {
      if (link.href.startsWith("/collections/")) {
        slugs.add(link.href.replace("/collections/", ""));
      }
    });
  });

  slugs.add("occasions");
  slugs.add("age-2-4y");
  slugs.add("age-4-6y");
  slugs.add("age-6-8y");
  slugs.add("age-8-12y");
  slugs.add("gifts-naming-ceremony");
  slugs.add("gifts-baby-shower");
  slugs.add("baby-best-sellers");
  return Array.from(slugs);
}

export const allCollectionSlugs: string[] = extractCollectionSlugs();

const slugTitleMap: Record<string, { title: string; eyebrow: string }> = {
  "baby-toddler": { title: "Baby + Toddler", eyebrow: "Collection" },
  "age-0-6m": { title: "0–6 months", eyebrow: "Shop by age" },
  "age-6-12m": { title: "6–12 months", eyebrow: "Shop by age" },
  "age-1-2y": { title: "1–2 years", eyebrow: "Shop by age" },
  "age-2-4y": { title: "2–4 years", eyebrow: "Shop by age" },
  "age-4-6y": { title: "4–6 years", eyebrow: "Shop by age" },
  "age-6-8y": { title: "6–8 years", eyebrow: "Shop by age" },
  "age-8-12y": { title: "8–12 years", eyebrow: "Shop by age" },
  "baby-new-in": { title: "New in", eyebrow: "Baby + Toddler" },
  "baby-best-sellers": { title: "Best sellers – Baby + Toddler", eyebrow: "Baby + Toddler" },
  "baby-girl-best-sellers": { title: "Best sellers – Baby girl", eyebrow: "Baby + Toddler" },
  "baby-boy-best-sellers": { title: "Best sellers – Baby boy", eyebrow: "Baby + Toddler" },
  "naming-ceremony": { title: "Naming ceremony", eyebrow: "Occasions" },
  "first-birthday": { title: "First birthday", eyebrow: "Occasions" },
  "sibling-matching": { title: "Sibling matching", eyebrow: "Featured" },
  "baby-girls": { title: "Baby girls", eyebrow: "Baby + Toddler" },
  "baby-girls-tops": { title: "Baby girls – Tops", eyebrow: "Baby girls" },
  "baby-girls-bottoms": { title: "Baby girls – Bottoms", eyebrow: "Baby girls" },
  "baby-girls-one-pieces": { title: "Baby girls – One-pieces", eyebrow: "Baby girls" },
  "baby-girls-sets": { title: "Baby girls – Sets", eyebrow: "Baby girls" },
  "baby-girls-dresses": { title: "Baby girls – Dresses", eyebrow: "Baby girls" },
  "baby-girls-outerwear": { title: "Baby girls – Outerwear", eyebrow: "Baby girls" },
  "baby-girls-nightwear": { title: "Baby girls – Nightwear", eyebrow: "Baby girls" },
  "baby-girls-accessories": { title: "Baby girls – Accessories", eyebrow: "Baby girls" },
  "baby-boys": { title: "Baby boys", eyebrow: "Baby + Toddler" },
  "baby-boys-tops": { title: "Baby boys – Tops", eyebrow: "Baby boys" },
  "baby-boys-bottoms": { title: "Baby boys – Bottoms", eyebrow: "Baby boys" },
  "baby-boys-one-pieces": { title: "Baby boys – One-pieces", eyebrow: "Baby boys" },
  "baby-boys-sets": { title: "Baby boys – Sets", eyebrow: "Baby boys" },
  "baby-boys-outerwear": { title: "Baby boys – Outerwear", eyebrow: "Baby boys" },
  "baby-boys-nightwear": { title: "Baby boys – Nightwear", eyebrow: "Baby boys" },
  "baby-boys-accessories": { title: "Baby boys – Accessories", eyebrow: "Baby boys" },
  "girls": { title: "Girls", eyebrow: "Collection" },
  "girls-2-4y": { title: "2–4 years", eyebrow: "Girls" },
  "girls-4-6y": { title: "4–6 years", eyebrow: "Girls" },
  "girls-6-8y": { title: "6–8 years", eyebrow: "Girls" },
  "girls-8-12y": { title: "8–12 years", eyebrow: "Girls" },
  "girls-new-in": { title: "New in", eyebrow: "Girls" },
  "girls-best-sellers": { title: "Best sellers – Girls", eyebrow: "Girls" },
  "festive": { title: "Festive", eyebrow: "Occasions" },
  "girls-tops": { title: "Girls – Tops", eyebrow: "Girls" },
  "girls-bottoms": { title: "Girls – Bottoms", eyebrow: "Girls" },
  "girls-dresses": { title: "Girls – Dresses", eyebrow: "Girls" },
  "girls-sets": { title: "Girls – Sets", eyebrow: "Girls" },
  "girls-ethnic-wear": { title: "Girls – Ethnic wear", eyebrow: "Girls" },
  "girls-outerwear": { title: "Girls – Outerwear", eyebrow: "Girls" },
  "girls-nightwear": { title: "Girls – Nightwear", eyebrow: "Girls" },
  "girls-accessories": { title: "Girls – Accessories", eyebrow: "Girls" },
  "boys": { title: "Boys", eyebrow: "Collection" },
  "boys-2-4y": { title: "2–4 years", eyebrow: "Boys" },
  "boys-4-6y": { title: "4–6 years", eyebrow: "Boys" },
  "boys-6-8y": { title: "6–8 years", eyebrow: "Boys" },
  "boys-8-12y": { title: "8–12 years", eyebrow: "Boys" },
  "boys-new-in": { title: "New in", eyebrow: "Boys" },
  "boys-best-sellers": { title: "Best sellers – Boys", eyebrow: "Boys" },
  "boys-tops": { title: "Boys – Tops", eyebrow: "Boys" },
  "boys-bottoms": { title: "Boys – Bottoms", eyebrow: "Boys" },
  "boys-sets": { title: "Boys – Sets", eyebrow: "Boys" },
  "boys-ethnic-wear": { title: "Boys – Ethnic wear", eyebrow: "Boys" },
  "boys-outerwear": { title: "Boys – Outerwear", eyebrow: "Boys" },
  "boys-nightwear": { title: "Boys – Nightwear", eyebrow: "Boys" },
  "boys-accessories": { title: "Boys – Accessories", eyebrow: "Boys" },
  "occasions": { title: "Occasions", eyebrow: "Collection" },
  "family-functions": { title: "Family functions", eyebrow: "Occasions" },
  "everyday-comfort": { title: "Everyday comfort", eyebrow: "Occasions" },
  "nightwear": { title: "Nightwear", eyebrow: "Every day" },
  "gifts-naming-ceremony": { title: "Naming ceremony gifts", eyebrow: "Gift guide" },
  "gifts-baby-shower": { title: "Baby shower gifts", eyebrow: "Gift guide" },
  "gifts-girls": { title: "Gifts for girls", eyebrow: "Gift guide" },
  "gifts-boys": { title: "Gifts for boys", eyebrow: "Gift guide" },
};

export function collectionTitle(slug: string): { title: string; eyebrow: string } {
  if (slugTitleMap[slug]) {
    return slugTitleMap[slug];
  }
  const formatted = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return { title: formatted, eyebrow: "Collection" };
}

export type DepartmentId = "baby-toddler" | "girls" | "boys" | "gifting";

export const departments: { id: DepartmentId; label: string }[] = [
  { id: "baby-toddler", label: "Baby + Toddler" },
  { id: "girls", label: "Girls" },
  { id: "boys", label: "Boys" },
  { id: "gifting", label: "Gifting" },
];

export interface DrawerDepartmentContent {
  highlight: NavLink;
  accordions: NavGroup[];
  quickLinks: NavLink[];
}

const namingHighlight: NavLink = {
  label: "Naming Ceremony Edit",
  href: "/collections/naming-ceremony",
};

export const drawerNav: Record<DepartmentId, DrawerDepartmentContent> = {
  "baby-toddler": {
    highlight: namingHighlight,
    accordions: [
      {
        title: "Baby girls",
        links: [
          col("All", "baby-girls"),
          col("Tops", "baby-girls-tops"),
          col("Bottoms", "baby-girls-bottoms"),
          col("One-pieces", "baby-girls-one-pieces"),
          col("Sets", "baby-girls-sets"),
          col("Dresses", "baby-girls-dresses"),
          col("Outerwear", "baby-girls-outerwear"),
          col("Nightwear", "baby-girls-nightwear"),
          col("Accessories", "baby-girls-accessories"),
        ],
      },
      {
        title: "Baby boys",
        links: [
          col("All", "baby-boys"),
          col("Tops", "baby-boys-tops"),
          col("Bottoms", "baby-boys-bottoms"),
          col("One-pieces", "baby-boys-one-pieces"),
          col("Sets", "baby-boys-sets"),
          col("Outerwear", "baby-boys-outerwear"),
          col("Nightwear", "baby-boys-nightwear"),
          col("Accessories", "baby-boys-accessories"),
        ],
      },
      {
        title: "Shop by age",
        links: [
          col("0–6 months", "age-0-6m"),
          col("6–12 months", "age-6-12m"),
          col("1–2 years", "age-1-2y"),
        ],
      },
    ],
    quickLinks: [
      col("Shop all", "baby-toddler"),
      col("New in", "baby-new-in"),
      col("Best sellers", "baby-best-sellers"),
      col("Sibling matching", "sibling-matching"),
    ],
  },
  girls: {
    highlight: namingHighlight,
    accordions: [
      {
        title: "Clothing",
        links: [
          col("All", "girls"),
          col("Tops", "girls-tops"),
          col("Bottoms", "girls-bottoms"),
          col("Dresses", "girls-dresses"),
          col("Sets", "girls-sets"),
          col("Ethnic wear", "girls-ethnic-wear"),
          col("Outerwear", "girls-outerwear"),
          col("Nightwear", "girls-nightwear"),
          col("Accessories", "girls-accessories"),
        ],
      },
      {
        title: "Shop by age",
        links: [
          col("2–4 years", "girls-2-4y"),
          col("4–6 years", "girls-4-6y"),
          col("6–8 years", "girls-6-8y"),
          col("8–12 years", "girls-8-12y"),
        ],
      },
    ],
    quickLinks: [
      col("Shop all", "girls"),
      col("New in", "girls-new-in"),
      col("Best sellers", "girls-best-sellers"),
      col("Sibling matching", "sibling-matching"),
    ],
  },
  boys: {
    highlight: namingHighlight,
    accordions: [
      {
        title: "Clothing",
        links: [
          col("All", "boys"),
          col("Tops", "boys-tops"),
          col("Bottoms", "boys-bottoms"),
          col("Sets", "boys-sets"),
          col("Ethnic wear", "boys-ethnic-wear"),
          col("Outerwear", "boys-outerwear"),
          col("Nightwear", "boys-nightwear"),
          col("Accessories", "boys-accessories"),
        ],
      },
      {
        title: "Shop by age",
        links: [
          col("2–4 years", "boys-2-4y"),
          col("4–6 years", "boys-4-6y"),
          col("6–8 years", "boys-6-8y"),
          col("8–12 years", "boys-8-12y"),
        ],
      },
    ],
    quickLinks: [
      col("Shop all", "boys"),
      col("New in", "boys-new-in"),
      col("Best sellers", "boys-best-sellers"),
      col("Sibling matching", "sibling-matching"),
    ],
  },
  gifting: {
    highlight: namingHighlight,
    accordions: [
      {
        title: "Gift guide",
        links: [
          col("Naming ceremony gifts", "gifts-naming-ceremony"),
          col("Baby shower gifts", "gifts-baby-shower"),
          col("Gifts for girls", "gifts-girls"),
          col("Gifts for boys", "gifts-boys"),
        ],
      },
    ],
    quickLinks: [
      { label: "Gift shop", href: "/gifting" },
      { label: "Gifting help", href: "/contact" },
    ],
  },
};

export interface DrawerSubMenu {
  id: "occasions" | "our-story" | "recently-viewed";
  label: string;
  links?: NavLink[];
}

export const drawerMore: DrawerSubMenu[] = [
  {
    id: "occasions",
    label: "Occasions",
    links: [
      col("Naming ceremony", "naming-ceremony"),
      col("First birthday", "first-birthday"),
      col("Festive", "festive"),
      col("Family functions", "family-functions"),
      col("Everyday comfort", "everyday-comfort"),
      col("Nightwear", "nightwear"),
    ],
  },
  {
    id: "our-story",
    label: "Our Story",
    links: [
      { label: "Our story", href: "/our-story" },
      { label: "Made under our own watch", href: "/our-story#made-under-our-watch" },
      { label: "Fabric & care", href: "/fabric-care" },
    ],
  },
  {
    id: "recently-viewed",
    label: "Recently viewed",
  },
];

export const drawerFooterLinks: {
  label: string;
  href?: string;
  action?: "account";
}[] = [
  { label: "Sign in", action: "account" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Track order", href: "/track-order" },
  { label: "Contact", href: "/contact" },
];
