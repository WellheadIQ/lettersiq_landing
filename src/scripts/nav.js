const chicago = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

const pad = (n) => String(n).padStart(2, "0");

function untilBriefing() {
  const parts = Object.fromEntries(chicago.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const now = Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second);
  let left = 7 * 3600 - now;
  if (left <= 0) left += 86400;
  return `${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`;
}

export function initNav({ onNavigate } = {}) {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const clock = nav.querySelector("[data-next-briefing]");
  if (clock) {
    const tick = () => {
      clock.textContent = `Next briefing in ${untilBriefing()}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  const toggle = nav.querySelector("[data-nav-toggle]");
  const sheet = nav.querySelector("[data-nav-sheet]");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    sheet.hidden = !open;
    nav.classList.toggle("is-open", open);
  };
  toggle?.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  sheet?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (onNavigate) {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      onNavigate(target);
      history.pushState(null, "", id);
    });
  }
}
