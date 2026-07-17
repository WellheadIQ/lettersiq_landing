---
target: the site (src/pages/index.astro)
total_score: 21
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-07-16T22-49-25Z
slug: src-pages-index-astro
---
# LettersIQ Site Critique — src/pages/index.astro

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form feedback exists; no active-section nav state |
| 2 | Match System / Real World | 2 | Operator language mixed with unexplained codes (W-3X, DLQ, P-17) early |
| 3 | User Control and Freedom | 3 | Escapes exist; long page, weak mobile skip-to-price/contact |
| 4 | Consistency and Standards | 2 | Visual system cohesive; CTA labels drift across sections |
| 5 | Error Prevention | 2 | Contact validates on every keystroke; phone requires raw 10 digits |
| 6 | Recognition Rather Than Recall | 3 | Single page; FAQ wall forces scanning |
| 7 | Flexibility and Efficiency | 1 | One rigid scroll path; few accelerators |
| 8 | Aesthetic and Minimalist Design | 1 | Mono labels, stars, slashes, codes, grids compete every fold |
| 9 | Error Recovery | 2 | Inline errors exist; costume error copy (`/// ERROR`) weak recovery |
| 10 | Help and Documentation | 2 | FAQ present but labeled "Documentation"; not contextual at Pricing/Contact |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM:** Partial → leaning Yes AI slop. Domain specificity (RRC, blast radius) saves it from total genericism; surface grammar (01–09 labels, `///` eyebrows, cream parchment, identical card grids, hero metrics) is saturated template language.

**Deterministic scan:** CLI `detect.mjs` on `src/pages` + `src/components` exited 0 with `[]`. Runtime browser detector found **104** atomic findings across **84** overlay nodes (70 visible). Top rules: tiny-text 33, wide-tracking 20, nested-cards 14, low-contrast 12, dark-glow 6, repeated-section-kickers 6, clipped-overflow-container 5; also all-caps-body, cream-palette, overused-font (Space Grotesk), repeating-stripes-gradient, codex-grid-background, gpt-thin-border-wide-shadow, line-length.

**Agreement:** Runtime detector corroborates LLM on cream palette, repeated kickers, nested cards, grid/stripe decoration, Space Grotesk overuse, low contrast, wide-tracked tiny labels. CLI clean vs runtime dirty is expected (CSS/computed-style rules).

**Likely false positives / intentional brand:** dark-glow on signalRed, cream parchment as committed Lone Star canvas, some eyebrow tracking — flag as over-application of brand costume, not wrong palette choice.

## Overall Impression

Strong product POV in Blast Radius and clear `$4` pricing, buried under scaffolding and mid-page feature-grid repetition. Biggest opportunity: ration the instrument-panel grammar and put the blast-radius story earlier so the page peaks before fatigue.

## What's Working

1. **Blast Radius** — Distinctive stakes, product artifact, emotional clarity; best fold.
2. **Pricing** — One plan, big `$4`, no feature gates; low decision cost.
3. **Hero product proof** — Real dashboard screenshot beats abstract diagram.

## Priority Issues

### [P1] Section scaffolding grammar everywhere
- **What:** `SectionLabel` stamps 01–09 plus `///` mono eyebrows on nearly every block.
- **Why:** Reads as AI landing OS; exhausts attention before Blast Radius.
- **Fix:** Kill numbers except real sequences; ration `///`/stars to ≤2–3 page-wide.
- **Suggested command:** `$impeccable quieter`

### [P1] Mid-page sameness / card-grid overload
- **What:** Coverage 8-up + Features1 6-up + Testimonials 3-up + Features2 + FeaturesDiagonal.
- **Why:** Users never mentally reach Pricing; high abandon mid-scroll.
- **Fix:** Merge feature beats; Coverage → 3 hero sources + disclosure for the rest.
- **Suggested command:** `$impeccable distill`

### [P1] Hero first-viewport clutter + metric template
- **What:** Announcement bar duplicates eyebrow; SYSTEM/DATASETS chips; ticker noise.
- **Why:** Brand/H1/CTA fight the fold; violates hero budget.
- **Fix:** One eyebrow; cut or collapse chips; keep ticker only if product-meaningful.
- **Suggested command:** `$impeccable layout`

### [P2] Contact form hostile to conversion
- **What:** Validate-on-change; phone `\d{10}` no format; `///` error costume.
- **Why:** Primary CTA path punishes typing/paste; mobile friction.
- **Fix:** Blur/submit validation; strip/format phone; plain-language errors.
- **Suggested command:** `$impeccable harden`

### [P2] Trust & copy rot
- **What:** Stock testimonials; Features1 "EMBRACE CONVENIENCE"; WellheadIQ leakage in asset chrome.
- **Why:** Undermines Blast Radius / RRC voice; Riley smells fiction.
- **Fix:** Real operators or cut; rewrite kickers; scrub brand leakage.
- **Suggested command:** `$impeccable clarify`

## Persona Red Flags

**Jordan (First-Timer):** Hero leads with dataset jargon; Coverage SRC codes assume literacy; FAQ buried as "Documentation"; live phone validation punishes typing. Abandon: mid-Coverage or first form error.

**Riley (Stress Tester):** "VERIFIED" testimonials without companies; WellheadIQ vs LettersIQ inconsistency; phone rejects formatted paste; FAQ Alert Engine opt-in vs Pricing "everything included." Abandon: after Testimonials or form trap.

**Casey (Distracted Mobile):** Tall sticky chrome; Pricing/Contact buried in hamburger; ~11k px page loses place on interrupt; dense Coverage + ticker. Abandon: after 1–2 scrolls.

## Minor Observations

- FAQ duplicate headings in a11y tree; Pricing `$4` tracking `-0.07em` past floor; navbar glass more decorative than navigational; ScrollUpButton thumb competition; reduced-motion handling exists (good). Detector also flagged low-contrast (12) and clipped overflow (5) — worth an audit pass.

## Questions to Consider

1. If Blast Radius is the only inevitable fold, why is it section 06 after three feature repeats?
2. Would Coverage convert better with three threats + disclosure?
3. Is "instrument panel" a rationed brand system or a costume on every label?
4. What if Testimonials were deleted until one named Texas operator exists?
5. Why does Get Started feel like a debug console instead of a handshake?
