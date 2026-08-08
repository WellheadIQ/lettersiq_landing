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
    "LettersIQ — a 7 AM briefing that connects eight Texas Railroad Commission datasets into one severance early-warning email.",
  themeColor: "#060d1b",
  locale: "en_US",
  price: { amount: "4", currency: "USD", unit: "lease per month" },
};

// Kept under ~155 characters so Google renders it whole rather than truncating.
export const defaultDescription =
  "Texas RRC compliance monitoring. LettersIQ watches 8 Railroad Commission datasets and emails one 7 AM briefing so you can stop a shut-in before the letter.";
