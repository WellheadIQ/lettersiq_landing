/*
 * Host for the Hairline figures in src/figures. The kernel is inlined on the
 * page as a classic script, so `HL` is a global before any module runs; each
 * figure module calls `hairline({ name, range, mount, ... })` once, and every
 * [data-hl="<name>"] stage on the page gets its own mount. The read-out goes
 * to the plate's [data-hl-read] and is re-broadcast as an `hl:read` event so
 * the HTML around a figure can answer it.
 */

const HL = window.HL;

function mount(stage, figure) {
  if (stage.hasAttribute("data-hairline")) return;
  HL.inject(document);
  stage.setAttribute("data-hairline", figure.name);
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, stage);
  const out = stage.closest("[data-hl-plate]")?.querySelector("[data-hl-read]");
  const hint = out?.dataset.rest ?? "rest";

  let text = null;
  const read = {
    get textContent() {
      return text;
    },
    set textContent(value) {
      text = value == null ? "" : String(value);
      if (out) out.textContent = text === "rest" ? hint : text;
      stage.dispatchEvent(new CustomEvent("hl:read", { bubbles: true, detail: text }));
    },
  };

  figure.mount({ stage, svg, read }, figure.range[1]);
  if (text === null) read.textContent = "rest";
}

window.hairline = (figure) => {
  document.querySelectorAll(`[data-hl="${figure.name}"]`).forEach((stage) => mount(stage, figure));
};

/** Holds the figure's pointer at a viewBox point, as a hand would, so other controls can drive it. */
export function pointAt(stage, [x, y]) {
  const r = stage.getBoundingClientRect();
  stage.dispatchEvent(
    new PointerEvent("pointermove", {
      pointerType: "mouse",
      pointerId: 1,
      bubbles: true,
      clientX: r.left + (x / 400) * r.width,
      clientY: r.top + (y / 320) * r.height,
    })
  );
}

export function release(stage) {
  stage.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse", pointerId: 1 }));
}
