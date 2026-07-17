import React from "react";
import LettersIQLogo from "/lettersiqlogo.png";
import wellheadiqLogo from "../assets/icons/wellheadiq_logo.png";
import { StarMark } from "./Primitives.jsx";

// Keep in lockstep with Navbar — fewer choices, same destinations.
const navLinks = [
  { label: "Blast Radius", href: "#blast-radius" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Coverage", href: "#coverage" },
  { label: "Pricing", href: "#pricing" },
  { label: "Get Started", href: "#contact-us" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Full-bleed signal-red closing band — the page's signature */}
      <div className="w-full bg-signalRed">
        <div className="section-shell py-12 md:py-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <StarMark size={40} className="text-white shrink-0" />
            <div>
              <div className="font-display font-extrabold text-white text-2xl md:text-4xl leading-none">
                Stop severances before the letter.
              </div>
              <div className="mt-2 text-sm text-white/80">
                One briefing. Every operator. Every morning.
              </div>
            </div>
          </div>
          <a
            href="#contact-us"
            className="hidden sm:inline-flex items-center gap-2 bg-white text-signalRed font-mono text-sm uppercase tracking-[0.12em] font-medium px-7 py-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.96]"
            style={{ borderRadius: 2 }}
          >
            Get Started <span aria-hidden>&rarr;</span>
          </a>
        </div>
      </div>

      <footer className="bg-midnight border-t border-white/10 py-14 md:py-16 relative overflow-hidden">
        <div className="section-shell">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <img src={LettersIQLogo} alt="LettersIQ" className="h-10 w-auto mb-5" />
              <p className="mb-5 max-w-sm text-sm leading-relaxed text-white/65">
                Daily compliance monitoring for Texas oil and gas operators.
                Eight RRC datasets, connected into one morning briefing.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/65">
                <span>Made with</span>
                <StarMark size={12} className="text-signalRed" />
                <span>in Austin, TX</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-4">
              <div className="mb-5 text-sm font-semibold text-white/70">Navigation</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex min-h-11 items-center text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Powered by */}
            <div className="md:col-span-3">
              <div className="mb-5 text-sm font-semibold text-white/70">Powered by</div>
              <a
                href="https://www.wellheadiq.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 p-3 border border-white/15 hover:border-white/45 transition-colors group"
              >
                <img src={wellheadiqLogo} alt="WellheadIQ" className="h-6" />
                <span className="text-sm text-white/65 group-hover:text-white">
                  WELLHEADIQ
                </span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-white/65">
                &copy; {currentYear} LettersIQ. All rights reserved.
              </div>
              <div className="text-center text-sm text-white/65 md:text-right">
                <a href="/privacy-policy" className="inline-flex min-h-11 items-center transition-colors hover:text-white">
                  Privacy
                </a>
                <span className="mx-3 text-white/20">|</span>
                Not affiliated with the Texas Railroad Commission.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
