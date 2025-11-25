import React from 'react';
import wellheadiqLogo from '../assets/icons/wellheadiq_logo.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-labBg border-t border-labBorder py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <div className="font-mono text-xs text-labFgMuted uppercase tracking-widest mb-4">
              /// LETTERSIQ
            </div>
            <p className="text-labFgMuted text-sm leading-relaxed mb-4">
              Compliance monitoring and severance prevention for Texas oil and gas operators.
            </p>
            <div className="flex items-center gap-2 text-sm text-labFgMuted">
              <span>Made with</span>
              <span className="text-red-500">&hearts;</span>
              <span>in Austin, TX</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="font-mono text-xs text-labFgMuted uppercase tracking-widest mb-4">
              NAVIGATION
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'FAQ', href: '#FAQ' },
                { label: 'Contact', href: '#contact-us' },
                { label: 'Privacy', href: '/privacy-policy' },
              ].map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-labFgMuted hover:text-labFg text-sm transition-colors flex items-center gap-2 group"
                >
                  <span className="font-mono text-xs text-labFgMuted group-hover:text-labAccent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Powered by */}
          <div>
            <div className="font-mono text-xs text-labFgMuted uppercase tracking-widest mb-4">
              POWERED BY
            </div>
            <a 
              href="https://www.wellheadiq.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-3 border border-labBorder hover:border-labFg transition-colors group"
            >
              <img src={wellheadiqLogo} alt="WellheadIQ" className="h-6" />
              <span className="font-mono text-xs text-labFgMuted group-hover:text-labFg">
                WELLHEADIQ
              </span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-labBorder">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xs text-labFgMuted">
              &copy; {currentYear} LettersIQ. All rights reserved.
            </div>
            <div className="font-mono text-xs text-labFgMuted text-center md:text-right">
              LettersIQ is not affiliated with the Texas Railroad Commission.
            </div>
          </div>
          
          {/* Technical footer decoration */}
          <div className="mt-8 flex items-center justify-center gap-4 font-mono text-xs text-labFgMuted/50">
            <span>{">>>>>>>>>"}</span>
            <span>END OF DOCUMENT</span>
            <span>{"<<<<<<<<<<<"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
