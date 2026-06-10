import React from "react";
import LettersIQLogo from "/lettersiqlogo.png";
import wellheadiqLogo from "../assets/icons/wellheadiq_logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#FAQ" },
  { label: "Contact", href: "#contact-us" },
  { label: "Privacy", href: "/privacy-policy" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink border-t border-white/10 py-14 md:py-16 relative overflow-hidden">
      <div className="section-shell">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img src={LettersIQLogo} alt="LettersIQ" className="h-10 w-auto mb-5" />
            <p className="text-white/55 text-sm leading-relaxed max-w-sm mb-5">
              Compliance monitoring and severance prevention for Texas oil and gas
              operators. Daily RRC intelligence, delivered.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/55">
              <span>Made with</span>
              <span className="text-ember">&hearts;</span>
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
                  <span className="font-mono text-[11px] text-white/30 group-hover:text-ember transition-colors">
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
              Not affiliated with the Texas Railroad Commission.
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 font-mono text-[11px] tracking-wider text-white/20">
            <span className="text-ember/50">{">>>>>"}</span>
            <span>END OF DOCUMENT</span>
            <span className="text-ember/50">{"<<<<<"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
