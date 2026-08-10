export const site = {
  name: "LettersIQ",
  // Must match the domain Vercel actually serves: the apex 308-redirects to www,
  // so canonicals/sitemap/og:url all have to be www or they point at a redirect.
  // Flip this (and the Vercel primary domain) together if apex ever becomes canonical.
  url: "https://www.lettersiq.com",
  parent: {
    name: "WellheadIQ",
    url: "https://www.wellheadiq.com/",
  },
  email: "privacy@wellheadiq.com",
  logo: "/lettersiqlogo.png",
  ogImage: "/og-lettersiq.png",
  ogImageAlt:
    "LettersIQ connects eight Texas Railroad Commission systems into one prioritized morning briefing for Texas oil and gas operators.",
  themeColor: "#060d1b",
  locale: "en_US",
  // Entry plan — schema.org offers advertise the lowest price a buyer can pay.
  price: { amount: "399", currency: "USD", unit: "month" },
};

// Kept under ~155 characters so Google renders it whole rather than truncating.
export const defaultDescription =
  "Texas RRC regulatory intelligence connecting eight systems into one morning briefing: what changed, what it affects, and what needs attention.";
