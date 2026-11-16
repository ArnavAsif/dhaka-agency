'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface NavbarProps {
  onNavigate?: (id: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const navItems = [
    { num: '01', label: 'Agency', href: '#agency' },
    { num: '02', label: 'Clients', href: '#clients' },
    { num: '03', label: 'Work', href: '#work' },
    { num: '04', label: 'Team', href: '#team' },
    { num: '05', label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(href.replace('#', ''));
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav__bar">
          <Link
            href="/"
            className="nav__logo"
            aria-label="Agence F+ — home"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Image
              src="/images/logo-ondark.png"
              alt="agence f+"
              width={112}
              height={32}
              priority
            />
          </Link>

          <div className="nav__actions">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              className="nav__toggle"
              aria-label="Invert colors (light / dark mode)"
              title="Invert colors (light / dark mode)"
              onClick={toggleTheme}
            >
              <span className="nav__toggle-icon" />
            </button>

            {/* Menu Open Button */}
            <button
              type="button"
              className="nav__menu"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="nav__menu-label">Menu</span>
              <span className="nav__burger">
                <span className="nav__burger-line" />
                <span className="nav__burger-line nav__burger-line--gold" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Dialog */}
      <div
        className={`overlay ${menuOpen ? 'overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <div className="overlay__inner">
          <div className="overlay__top">
            <Link
              href="/"
              className="overlay__logo-link"
              onClick={() => {
                setMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Image
                src="/images/logo-ondark.png"
                alt="agence f+"
                className="overlay__logo"
                width={112}
                height={32}
              />
            </Link>

            <button
              type="button"
              className="overlay__close"
              aria-label="Close"
              onClick={() => setMenuOpen(false)}
            >
              <span className="overlay__close-label">Close</span>
              <span className="overlay__close-x" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>

          <nav className="overlay__nav">
            {navItems.map((item, index) => (
              <a
                key={item.num}
                href={item.href}
                className="overlay__link"
                style={{ '--i': index } as React.CSSProperties}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
              >
                <span className="overlay__num">{item.num}</span>
                <span className="overlay__label">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="overlay__foot">
            <a href="mailto:at@fplusagency.com" className="overlay__mail">
              at@fplusagency.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
