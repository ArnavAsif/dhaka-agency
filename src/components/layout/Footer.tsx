'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <Link
            href="/"
            className="footer__logo footer__brand-title"
            aria-label="DHAKA AGENCY — home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className="footer__brand-dhaka">DHAKA</span>{' '}
            <span className="footer__brand-agency">AGENCY</span>
          </Link>

          <nav className="footer__nav">
            <a
              href="#agency"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('agency');
              }}
            >
              Services
            </a>
            <a
              href="#work"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
              }}
            >
              Case Studies
            </a>
            <a
              href="#agency"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('agency');
              }}
            >
              Expertise
            </a>
            <a
              href="mailto:nomaddigitalbd@gmail.com"
              className="footer__link"
            >
              nomaddigitalbd@gmail.com
            </a>
            <a
              href="tel:+8801644474317"
              className="footer__link"
            >
              +880 1644-474317
            </a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">
            © 2026 DHAKA AGENCY. All rights reserved. Built by experts, powered by data, designed to win. · Dhaka, Bangladesh
          </span>
          <div className="footer__legal">
            <a href="#privacy" className="footer__legal-link">
              Privacy Policy
            </a>
            <a href="#terms" className="footer__legal-link">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
