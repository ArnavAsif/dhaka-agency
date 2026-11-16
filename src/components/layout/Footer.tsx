'use client';

import React from 'react';
import Image from 'next/image';
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
            className="footer__logo"
            aria-label="Agence F+ — home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Image
              src="/images/logo-ondark.png"
              alt="agence f+"
              width={105}
              height={30}
            />
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
              Agency
            </a>
            <a
              href="#work"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
              }}
            >
              Clients
            </a>
            <a
              href="#work"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' });
              }}
            >
              Work
            </a>
            <a
              href="#agency"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('agency');
              }}
            >
              Team
            </a>
            <a
              href="#contact"
              className="footer__link"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('contact');
              }}
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">
            © 2026 Agence F+, Development, Communication and Digital Marketing.
          </span>
          <div className="footer__legal">
            <a href="#legal" className="footer__legal-link">
              Legal notice
            </a>
            <a href="#privacy" className="footer__legal-link">
              Privacy policy
            </a>
            <a href="#terms" className="footer__legal-link">
              Terms of use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
