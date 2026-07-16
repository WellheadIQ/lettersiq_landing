import React from "react";
import LettersIQLogo from "/lettersiqlogo.png";
import wellheadiqLogo from "../assets/icons/wellheadiq_logo.png";
import { StarMark } from "./Primitives.jsx";

const navLinks = [
  { label: "Coverage", href: "#coverage" },
  { label: "Features", href: "#features" },
  { label: "Blast Radius", href: "#blast-radius" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#FAQ" },
  { label: "Contact", href: "#contact-us" },
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
              <div className="font-mono text-[11px] tracking-[0.16em] text-white/80 mt-2">
                /// ONE BRIEFING. EVERY OPERATOR. EVERY MORNING.
              </div>
            </div>
          </div>
          <a
            href="#contact-us"
            className="hidden sm:inline-flex items-center gap-2 bg-white text-signalRed font-mono text-sm uppercase tracking-[0.12em] font-medium px-7 py-4 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
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
              <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-5">
                Predictive compliance monitoring for Texas oil and gas operators.
                Eight RRC datasets, connected into one daily briefing.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/55">
                <span>Made with</span>
                <StarMark size={12} className="text-signalRed" />
                <span>in Austin, TX</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-4">
              <div className="mono-label text-white/45 mb-5">/// NAVIGATION</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {navLinks.map((link, index) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/65 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="font-mono text-[11px] text-white/30 group-hover:text-signalRed transition-colors">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Powered by */}
            <div className="md:col-span-3">
              <div className="mono-label text-white/45 mb-5">POWERED BY</div>
              <a
                href="https://www.wellheadiq.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 p-3 border border-white/15 hover:border-white/45 transition-colors group"
              >
                <img src={wellheadiqLogo} alt="WellheadIQ" className="h-6" />
                <span className="font-mono text-[11px] tracking-wider text-white/55 group-hover:text-white">
                  WELLHEADIQ
                </span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="font-mono text-[11px] tracking-wider text-white/45">
                &copy; {currentYear} LettersIQ. All rights reserved.
              </div>
              <div className="font-mono text-[11px] tracking-wider text-white/45 text-center md:text-right">
                <a href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <span className="mx-3 text-white/20">|</span>
                Not affiliated with the Texas Railroad Commission.
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 font-mono text-[11px] tracking-wider text-white/20">
              <span className="text-signalRed/50">{">>>>>"}</span>
              <span>END OF DOCUMENT</span>
              <span className="text-signalRed/50">{"<<<<<"}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
