'use client';

import React from 'react';
import { Preloader } from '@/components/layout/Preloader';
import { Navbar } from '@/components/layout/Navbar';
import { HeroCanvas } from '@/components/canvas/HeroCanvas';
import { HorizontalTrack } from '@/components/home/HorizontalTrack';
import { ServicesSection } from '@/components/home/ServicesSection';
import { CtaSection } from '@/components/home/CtaSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'work' || sectionId === 'clients') {
      window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Preloader />
      <Navbar onNavigate={handleNavClick} />

      <main className="home">
        {/* Persistent 3D WebGL Canvas Layer */}
        <HeroCanvas />

        {/* Horizontal Project Scrub Track */}
        <HorizontalTrack />

        {/* Vertical Flow Sections */}
        <div className="home__vertical">
          <ServicesSection />
          <CtaSection />
          <Footer />
        </div>
      </main>
    </>
  );
}
