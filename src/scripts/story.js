const PAPER = { bg: "#f2eee5", line: "#1b1914", soft: "rgba(27,25,20,0.55)" };
const NIGHT = { bg: "#0f1115", line: "#ebe5d6", soft: "rgba(235,229,214,0.5)" };

// Chapter start times on the scrubbed timeline, in arbitrary units.
const AT = [0, 8, 18, 30, 41, 52];
const END = 62;

const CAMERAS = {
  desktop: {
    wide: "0 -250 2000 1250",
    neighbor: "700 105 1300 812",
    blast: "0 -210 2000 1250",
    day31: "0 -250 2000 1250",
    morning: "-160 -330 2160 1350",
    close: "-100 -300 2100 1312",
  },
  mobile: {
    wide: "60 -170 640 1280",
    pan: "1360 -170 640 1280",
    neighbor: "1380 -170 640 1280",
    blastFrom: "1380 -170 640 1280",
    blast: "0 -170 640 1280",
    day31: "905 -170 640 1280",
    morning: "120 -31 760 1520",
    close: "140 10 720 1440",
  },
};

const pad = (n) => String(n).padStart(2, "0");

export function initStory({ gsap, jacks, nav, sweep }) {
  const section = document.querySelector("[data-story]");
  if (!section) return;
  section.classList.add("is-live");

  const q = (s) => section.querySelector(s);
  const qa = (s) => [...section.querySelectorAll(s)];
  const pin = q("[data-story-pin]");
  const svg = q('svg[data-world="story"]');
  const chapters = qa(".chapter");
  const ticks = qa("[data-progress]");
  const label = (id) => q(`[data-label="${id}"]`);
  const labels = ["a", "b", "battery", "c"].map(label);
  const tracer = (id) => q(`[data-tracer="${id}"]`);
  const tracers = ["c", "a", "b"].map(tracer);
  const letter = q("[data-letter]");
  const ring = q("[data-letter-circle]");
  const stamp = q("[data-stamp]");
  const noChange = q('[data-part="no-change"]');
  const buriedNote = q('[data-part="buried-note"]');
  const stars = q("[data-stars]");
  const moon = q("[data-moon]");
  const sun = q("[data-sun]");
  const brief = q("[data-story-brief]");
  const done = q("[data-brief-done]");
  const strike = q("[data-brief-strike] path");
  const handH = q("[data-hand-h]");
  const handM = q("[data-hand-m]");
  const timeEl = q("[data-clock-time]");
  const dayEl = q("[data-clock-day]");
  const story = ["story-a", "story-b", "story-c"].map((id) => jacks.get(id));

  const clock = { m: 134, day: 1 };
  const renderClock = () => {
    const m = ((clock.m % 1440) + 1440) % 1440;
    const h24 = Math.floor(m / 60);
    const h12 = h24 % 12 || 12;
    timeEl.textContent = `${pad(h12)}:${pad(Math.floor(m % 60))} ${h24 < 12 ? "AM" : "PM"}`;
    dayEl.textContent = `Day ${pad(Math.round(clock.day))}`;
    handM.setAttribute("transform", `rotate(${(clock.m * 6) % 360})`);
    handH.setAttribute("transform", `rotate(${(clock.m * 0.5) % 360})`);
  };

  // Night falls as the section rises into view.
  gsap.fromTo(
    section,
    { "--bg": PAPER.bg, "--line": PAPER.line, "--line-soft": PAPER.soft },
    {
      "--bg": NIGHT.bg,
      "--line": NIGHT.line,
      "--line-soft": NIGHT.soft,
      ease: "none",
      scrollTrigger: { trigger: section, start: "top 90%", end: "top 10%", scrub: true },
    }
  );

  const worldPaths = [...svg.querySelectorAll(".ink-l, .ink-t, .ink-h")].filter(
    (p) => !p.closest(".annotations, .sky")
  );
  sweep(worldPaths, { trigger: section, start: "top 75%", spread: 1.8 });

  const mm = gsap.matchMedia();
  mm.add({ desktop: "(min-width: 900px)", mobile: "(max-width: 899px)" }, (ctx) => {
    const desktop = ctx.conditions.desktop;
    const cam = desktop ? CAMERAS.desktop : CAMERAS.mobile;

    gsap.set(svg, { attr: { viewBox: cam.wide } });
    gsap.set(chapters, { autoAlpha: 0, y: 28 });
    gsap.set(chapters[0], { autoAlpha: 1, y: 0 });
    gsap.set([...labels, buriedNote, noChange], { autoAlpha: 0 });
    gsap.set([ring, ...tracers, strike], { drawSVG: "0%", autoAlpha: 0 });
    gsap.set(letter, { autoAlpha: 0, y: -620, rotation: -24, transformOrigin: "50% 50%" });
    gsap.set(stamp, { autoAlpha: 0, scale: 2.6, rotation: -10, transformOrigin: "50% 50%" });
    gsap.set(brief, { autoAlpha: 0, y: 40 });
    gsap.set(done, { autoAlpha: 0, x: -8 });
    story.forEach((j) => j && (j.mult = 1));
    clock.m = 134;
    clock.day = 1;
    renderClock();

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        pin,
        start: "top top",
        end: desktop ? "+=620%" : "+=560%",
        scrub: 0.9,
        anticipatePin: 1,
        onLeave: () => nav?.classList.remove("is-night"),
        onLeaveBack: () => nav?.classList.remove("is-night"),
      },
      onUpdate: () => {
        const t = tl.time();
        let active = 0;
        AT.forEach((at, i) => {
          if (t >= at - 0.5) active = i;
        });
        ticks.forEach((tick, i) => tick.classList.toggle("is-on", i <= active));
        nav?.classList.toggle("is-night", !!tl.scrollTrigger?.isActive && t < 45.5);
      },
    });
    tl.to({}, { duration: END }, 0);

    const swap = (i) => {
      const at = AT[i];
      tl.to(chapters[i - 1], { autoAlpha: 0, y: -28, duration: 1.1, ease: "power2.in" }, at);
      tl.fromTo(chapters[i], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.3, ease: "power2.out", immediateRender: false }, at + 1);
    };
    const drawTo = (el, at, duration, ease = "power1.inOut") =>
      tl.fromTo(el, { drawSVG: "0%", autoAlpha: 1 }, { drawSVG: "100%", autoAlpha: 1, duration, ease, immediateRender: false }, at);

    // 01 · Three leases. Labels land in the order the camera meets them.
    if (!desktop) tl.to(svg, { attr: { viewBox: cam.pan }, duration: 6.5, ease: "power1.inOut" }, 0.5);
    labels.forEach((el, i) => tl.to(el, { autoAlpha: 1, duration: 1.2 }, 0.8 + i * (desktop ? 1 : 1.5)));
    tl.to(buriedNote, { autoAlpha: 1, duration: 1.2 }, desktop ? 4.6 : 6);

    // 02 · The letter drops on the neighbour.
    swap(1);
    tl.to(svg, { attr: { viewBox: cam.neighbor }, duration: 4, ease: "power2.inOut" }, AT[1]);
    tl.to([label("a"), label("b"), label("battery"), buriedNote], { autoAlpha: 0, duration: 1.5 }, AT[1]);
    tl.to(letter, { autoAlpha: 1, y: 0, rotation: 0, duration: 3, ease: "power3.out" }, AT[1] + 2);
    drawTo(ring, AT[1] + 4.6, 2.4);

    // 03 · The exposure runs back through the buried lines.
    swap(2);
    if (desktop) {
      tl.to(svg, { attr: { viewBox: cam.blast }, duration: 4, ease: "power2.inOut" }, AT[2]);
    } else {
      tl.fromTo(svg, { attr: { viewBox: cam.blastFrom } }, { attr: { viewBox: cam.blast }, duration: 8.5, ease: "power1.inOut", immediateRender: false }, AT[2] + 1);
    }
    tl.to([label("a"), label("b"), label("battery")], { autoAlpha: 1, duration: 1.5 }, AT[2] + 1);
    drawTo(tracers[0], AT[2] + 1.4, 3.6);
    drawTo(tracers[1], AT[2] + 5, 4.2);
    drawTo(tracers[2], AT[2] + 5.4, 3.6);
    tl.to(noChange, { autoAlpha: 1, duration: 1.4 }, AT[2] + 8);
    tl.to(clock, { m: 135, duration: 2, onUpdate: renderClock }, AT[2] + 1);

    // 04 · Day 31: fast-forward, the stamp lands, the pumps stop.
    swap(3);
    tl.to(svg, { attr: { viewBox: cam.day31 }, duration: 4, ease: "power2.inOut" }, AT[3]);
    tl.to([ring, letter, noChange], { autoAlpha: 0.2, duration: 1.5 }, AT[3]);
    tl.to(clock, { m: 135 + 1440 * 3 + 465, day: 31, duration: 4.5, ease: "power1.in", onUpdate: renderClock }, AT[3]);
    if (story[2]) tl.to(story[2], { mult: 0, duration: 2.5, ease: "power2.out" }, AT[3] + 2.4);
    tl.to(stamp, { autoAlpha: 1, scale: desktop ? 1.3 : 1, rotation: 0, duration: 0.9, ease: "power4.in" }, AT[3] + 4.8);
    tl.to(section, { "--wash": 0.1, duration: 0.6 }, AT[3] + 5.6);
    tl.to(pin, { x: 5, duration: 0.12, yoyo: true, repeat: 3, ease: "sine.inOut" }, AT[3] + 5.7);
    [story[0], story[1]].forEach((j, i) => j && tl.to(j, { mult: 0, duration: 3, ease: "power2.out" }, AT[3] + 5.8 + i * 0.6));

    // 05 · Rewind to 7:00 AM on day one; dawn; the briefing.
    swap(4);
    tl.to(stamp, { autoAlpha: 0, scale: 1.4, duration: 1.2, ease: "power2.in" }, AT[4]);
    tl.to(section, { "--wash": 0, duration: 1 }, AT[4]);
    tl.to(clock, { m: 420, day: 1, duration: 4.5, ease: "power2.inOut", onUpdate: renderClock }, AT[4]);
    tl.to([ring, letter], { autoAlpha: desktop ? 0 : 1, duration: 1.4 }, AT[4] + 1);
    story.forEach((j, i) => j && tl.to(j, { mult: 1, duration: 2.5, ease: "power1.in" }, AT[4] + 1 + i * 0.3));
    tl.to(svg, { attr: { viewBox: cam.morning }, duration: 4, ease: "power2.inOut" }, AT[4]);
    tl.fromTo(
      section,
      { "--bg": NIGHT.bg, "--line": NIGHT.line, "--line-soft": NIGHT.soft },
      { "--bg": PAPER.bg, "--line": PAPER.line, "--line-soft": PAPER.soft, duration: 5, ease: "power1.inOut", immediateRender: false },
      AT[4] + 2
    );
    tl.to(stars, { autoAlpha: 0, duration: 3 }, AT[4] + 2);
    tl.to(moon, { autoAlpha: 0, y: 260, duration: 4 }, AT[4] + 2);
    tl.to(sun, { y: 0, duration: 6, ease: "power1.out" }, AT[4] + 2.5);
    tl.to([label("c"), label("battery")], { autoAlpha: 0.2, duration: 2 }, AT[4] + 3.5);
    tl.to(brief, { autoAlpha: 1, y: 0, duration: 2.2, ease: "power3.out" }, AT[4] + 5);

    // 06 · The call, the cure, and three wells still pumping.
    swap(5);
    tl.to(clock, { m: 460, duration: 3, onUpdate: renderClock }, AT[5]);
    tl.fromTo(strike, { drawSVG: "0%", autoAlpha: 1 }, { drawSVG: "100%", autoAlpha: 1, duration: 1.6, ease: "power1.inOut", immediateRender: false }, AT[5] + 1);
    tl.to(done, { autoAlpha: 1, x: 0, duration: 1.4, ease: "power2.out" }, AT[5] + 2.2);
    tl.to([...tracers, ring, letter, noChange], { autoAlpha: 0, duration: 2.5 }, AT[5] + 2.5);
    tl.to(svg, { attr: { viewBox: cam.close }, duration: 6, ease: "power1.inOut" }, AT[5] + 1);

    return () => {
      story.forEach((j) => j && (j.mult = 1));
    };
  });
}
