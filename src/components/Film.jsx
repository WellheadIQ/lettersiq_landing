import React, { useEffect, useRef } from "react";
import { useAnimeScope } from "../hooks/useAnimeScope.js";
import { settle } from "../lib/motion.js";
import { SectionLabel } from "./Primitives.jsx";

/**
 * The 55-second explainer, played inline.
 *
 * It starts itself when it scrolls into view rather than waiting for a click —
 * an opt-in film is a film most visitors never see. Cost is deferred instead:
 * `preload="none"` means nothing but the poster is fetched until the section is
 * actually approaching the viewport, so the video never competes with the hero's
 * LCP even though it sits directly beneath it.
 */
export const Film = () => {
  const videoRef = useRef(null);

  const root = useAnimeScope(({ reduceMotion, anime }) => {
    if (reduceMotion) return;
    settle(anime, anime.utils.$(".film-settle"), { trigger: ".film-settle" });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return undefined;

    // A viewer who deliberately pauses has made a decision; scrolling away and
    // back must not override it.
    let pausedByUser = false;
    const onPause = () => {
      if (!video.ended && !video.seeking) pausedByUser = true;
    };
    const onPlay = () => {
      pausedByUser = false;
    };
    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);

    // Autoplay is a convenience, not the content — anyone who has asked for less
    // motion, or is on a metered or slow connection, gets the poster and controls
    // instead of three megabytes they did not request.
    const connection = navigator.connection;
    const withholdAutoplay =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ||
      connection?.saveData === true ||
      /^(slow-)?2g$/.test(connection?.effectiveType ?? "");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (withholdAutoplay || pausedByUser || video.ended) return;
          // play() rejects on some autoplay policies; the poster and controls
          // remain a complete fallback, so failure needs no handling.
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
          pausedByUser = false;
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
    };
  }, []);

  return (
    <section
      ref={root}
      id="film"
      className="relative w-full overflow-hidden bg-midnight py-16 md:py-24"
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-white/10" />

      <div className="section-shell relative z-10">
        <SectionLabel
          label="Regulatory operations intelligence · 55 seconds"
          className="mb-5"
        />

        <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-16">
          <h2 className="max-w-2xl text-balance font-display text-display-sm font-extrabold tracking-[-0.02em] text-white">
            See how one overnight change becomes an operating decision.
          </h2>
          <p className="max-w-md text-pretty text-base leading-relaxed text-white/65">
            LettersIQ checks eight RRC systems, connects changes to the leases,
            wells, permits, and commingles they affect, then ranks what can interrupt
            production or delay first sales.
          </p>
        </div>

        <figure className="film-settle mt-10 md:mt-12">
          {/* bg matches the film's own #060D1B ground, so the frame reads as a
              window onto the page rather than a pasted-in rectangle. */}
          <div className="relative overflow-hidden rounded-[3px] border border-white/15 bg-midnight shadow-float">
            <video
              ref={videoRef}
              controls
              muted
              playsInline
              preload="none"
              poster="/film/lettersiq-film-poster.jpg"
              width="1920"
              height="1080"
              className="block h-auto w-full"
            >
              <source src="/film/lettersiq-film.webm" type="video/webm" />
              <source src="/film/lettersiq-film.mp4" type="video/mp4" />
              Your browser cannot play this video. It shows LettersIQ connecting
              Texas Railroad Commission changes to affected operations and ranking
              the actions in a 7:00 AM briefing.
            </video>
          </div>

          <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-white/45">
            <span>55 seconds · no sound</span>
            <span aria-hidden="true">·</span>
            <span>
              Illustrative data. Operator names are fictional; lease, field and form
              data are public Texas RRC records.
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
