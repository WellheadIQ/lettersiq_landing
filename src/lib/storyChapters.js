/**
 * The scene ledger for the morning-loop scroll world.
 *
 * Camera endpoints are authored per chapter at desktop and mobile; world values
 * are plain scalars so any frame is a lerp between two neighbouring chapters.
 * Kept free of Three.js imports so the DOM story can read the same copy without
 * pulling the renderer into the main bundle.
 */
export const storyChapters = [
  {
    id: "watch",
    eyebrow: "01 / Overnight",
    title: "Eight systems, read while you sleep.",
    body: "Severance orders, certified letters, P-5 status, Rule 15, proration, commingles, drilling permits, purchaser filings. Every night, all of them, against your whole Texas portfolio.",
    camera: {
      position: [0.2, 5.3, 11.6],
      target: [0, 1.5, 0.1],
      fov: 34,
      mobile: { position: [0.2, 6.2, 14.4], fov: 46 },
    },
    world: { key: 0.85, rim: 1.0, fog: 0.052, alert: 0, join: 0, rank: 0, dawn: 0 },
  },
  {
    id: "change",
    eyebrow: "02 / The change",
    title: "One record moves at 2:14 AM.",
    body: "A certified pre-severance letter is filed against a lease on a commingle you share. Nothing in your own filings changed. Nothing in your inbox changed either.",
    camera: {
      position: [3.15, 3.85, 4.5],
      target: [1.24, 3.28, -0.5],
      fov: 32,
      mobile: { position: [3.7, 4.1, 5.9], fov: 44 },
    },
    world: { key: 0.8, rim: 1.15, fog: 0.05, alert: 1, join: 0, rank: 0, dawn: 0 },
  },
  {
    id: "connect",
    eyebrow: "03 / The connection",
    title: "The record is joined to what it touches.",
    body: "LettersIQ runs the P-17 commingle back to its co-members, then down to the leases and wells underneath. The exposure was never in one dataset. It was in the relationship between them.",
    camera: {
      position: [-2.6, 4.3, 9.3],
      target: [0.3, 1.55, 0.1],
      fov: 36,
      mobile: { position: [-2.9, 5.0, 11.8], fov: 46 },
    },
    world: { key: 0.95, rim: 1.0, fog: 0.044, alert: 1, join: 1, rank: 0, dawn: 0.08 },
  },
  {
    id: "rank",
    eyebrow: "04 / The ranking",
    title: "Findings are ordered by what they can stop.",
    body: "Production stopped outranks a permit that lapses in three weeks. Each line carries the consequence, the record behind it, and the next action, so nothing has to be re-derived at 7 AM.",
    camera: {
      position: [0.9, 1.8, 6.9],
      target: [0.9, 1.4, 1.85],
      fov: 29,
      mobile: { position: [0, 1.9, 7.6], target: [0, 1.4, 1.85], fov: 42 },
    },
    world: { key: 1.0, rim: 0.8, fog: 0.038, alert: 0.8, join: 1, rank: 1, dawn: 0.3 },
  },
  {
    id: "briefing",
    eyebrow: "05 / 7:00 AM",
    title: "Your team opens one list, not eight systems.",
    body: "The briefing lands before the first cup of coffee: what changed overnight, what it affects, and what needs attention. Everything else stays where it belongs — out of your morning.",
    camera: {
      position: [0.9, 2.1, 7.0],
      target: [0.85, 1.35, 1.6],
      fov: 31,
      mobile: { position: [0, 2.2, 8.4], target: [0, 1.35, 1.7], fov: 44 },
    },
    world: { key: 1.15, rim: 0.7, fog: 0.03, alert: 0.45, join: 0.8, rank: 1, dawn: 1 },
  },
];
