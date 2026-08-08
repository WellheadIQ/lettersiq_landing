import { site } from "../data/site.js";

// Generated rather than kept in public/ so the Sitemap line can never drift
// away from the canonical domain in site.js.
const AGENTS = [
  "*",
  // Answer engines / LLM crawlers — explicitly welcomed. The FAQ block is plain
  // Q&A and carries FAQPage schema, which is what these actually consume.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
];

export async function get() {
  const rules = AGENTS.map(
    (agent) => `User-agent: ${agent}\nAllow: /`
  ).join("\n\n");

  return {
    body: `${rules}\n\nSitemap: ${new URL("/sitemap.xml", site.url).href}\n`,
  };
}
