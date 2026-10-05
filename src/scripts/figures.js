import { pointAt, release } from "./hairline.js";
import "../figures/cabinet.js";
import "../figures/permit.js";
import "../figures/portfolio.js";
import "../figures/mailbox.js";

/* Coverage: a row pulls its drawer, and a drawer marks its row. */
const cabinet = document.querySelector('[data-hl="cabinet"]');
const rows = [...document.querySelectorAll("[data-hl-at]")];
if (cabinet && rows.length) {
  rows.forEach((row) => {
    const at = row.dataset.hlAt.split(",").map(Number);
    row.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && pointAt(cabinet, at));
    row.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && release(cabinet));
  });
  cabinet.addEventListener("hl:read", (e) => {
    rows.forEach((row) => row.classList.toggle("is-pointed", row.dataset.hlName === e.detail));
  });
}

/* Rates: the terrace the pointer reaches names the plan that would hold it. */
const field = document.querySelector('[data-hl="portfolio"]');
const tiers = [...document.querySelectorAll("[data-tier]")];
if (field && tiers.length) {
  field.addEventListener("hl:read", (e) => {
    const tier = e.detail === "rest" ? null : e.detail.split("· ")[1];
    tiers.forEach((el) => el.classList.toggle("is-pointed", el.dataset.tier === tier));
  });
}
