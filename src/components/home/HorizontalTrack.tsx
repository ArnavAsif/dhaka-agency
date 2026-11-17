'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PanelData {
  shape?: string;
  tag?: string;
  title?: string;
  desc?: string[];
  link?: string;
}

const PROJECTS_DATA: PanelData[] = [
  {
    shape: 'eighteen',
    tag: 'Featured Case Study · Paid Marketing',
    title: 'Aura Apparel — $3.2M Revenue',
    desc: [
      'Scaling Luxury Fashion E-Commerce Brand to $3.2M+ Revenue with Meta & Google Ads. Achieved +340% ROAS increase through precision audience segmentation and multivariate creative testing.',
      'At DHAKA AGENCY, we treat your business like our own. Backed by expert marketers, designers, and developers, our data-driven ad solutions turn ad spend into scalable, predictable revenue surges.',
    ],
    link: 'Explore Case Study',
  },
  {
    shape: 'glasses',
    tag: 'Featured Case Study · SEO Dominance',
    title: 'FlowMetrics AI — +520% Traffic',
    desc: [
      'Driving 520% Organic Traffic Growth & 12x Inbound Leads for B2B SaaS Platform. In today’s digital economy, visibility equals credibility—our strategic SEO gets real, lasting market dominance.',
      'We executed full-funnel technical SEO audits, high-intent keyword clustering, and authority backlink architecture that transformed organic search into a continuous demo engine.',
    ],
    link: 'Explore Case Study',
  },
  {
    shape: 'wheel',
    tag: 'Featured Case Study · Web Engineering',
    title: 'PayGrid Global — 0.4s Speed',
    desc: [
      'High-Performance Next.js Web Development & Rebrand for Global Fintech Giant. Delivered sub-0.4s load speed, ultra-secure architecture, and +85% conversion rate surge.',
      'Your website is your strongest salesperson. We engineer bespoke, mobile-responsive, and blazing-fast web platforms that captivate users and drive commercial results.',
    ],
    link: 'Explore Case Study',
  },
  {
    shape: 'pen',
    tag: 'Conversion Optimization · CRO',
    title: 'Turn Clicks Into Customers',
    desc: [
      'You’ve got traffic, but are they converting? If not, you don’t have a traffic problem—you have a conversion problem. That’s where Conversion Rate Optimization (CRO) comes in.',
      'We architect high-converting checkout flows, multivariate A/B testing frameworks, and behavioral heatmaps to eliminate revenue bottlenecks and scale business scalability.',
    ],
    link: 'Explore Solutions',
  },
  {
    shape: 'bottle',
    tag: 'Data Intelligence · Tracking',
    title: 'Turn Data Into Growth',
    desc: [
      'Web analytics involves tracking, measuring, and analyzing the behavior of website visitors. Understand your audience with Google Analytics 4, server-side tagging, and user journey attribution.',
      'We combine high-level technical expertise with transparent reporting dashboards so you track exact ROI on every dollar spent—cloud-based & Dhaka, Bangladesh.',
    ],
    link: 'Explore Solutions',
  },
];

export function HorizontalTrack() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.clearScrollMemory('manual');
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    // Both desktop and mobile use horizontal scrub: when scrolling down, next part comes in!
    track.classList.add('is-horizontal');
    document.documentElement.dataset.heroAxis = 'x';

    const panels = Array.from(track.querySelectorAll<HTMLElement>('.hpanel'));
    const getScrollDist = () => Math.max(0, track.scrollWidth - window.innerWidth);

    interface Measure {
      left: number;
      width: number;
      fx: HTMLElement | null;
    }

    let measures: Measure[] = [];
    const measure = () => {
      measures = panels.map((p) => ({
        left: p.offsetLeft,
        width: p.offsetWidth,
        fx: p.querySelector<HTMLElement>('.hp-fx'),
      }));
    };

    const expPower = 3;
    const computeThreshold = (w: number, maxHold: number) =>
      Math.min(w * 0.72, 840, maxHold);

    const updateFx = () => {
      const screenW = window.innerWidth;
      const isMobile = screenW < 1024;

      if (isMobile) {
        // Mobile: panels slide in naturally as the track scrubs.
        // Keep text stationary inside each panel and gracefully fade in/out so NO text is cut off or displaced.
        const trackLeft = track.getBoundingClientRect().left;
        for (let k = 0; k < measures.length; k++) {
          const item = measures[k];
          if (!item.fx) continue;

          item.fx.style.transform = 'translate3d(0px, 0px, 0px)';
          item.fx.style.filter = 'none';

          const panelCenterOnScreen = trackLeft + item.left + item.width / 2;
          const distFromCenter = Math.abs(panelCenterOnScreen - screenW / 2);
          const maxDist = screenW * 0.75;
          const opacity = Math.max(0, Math.min(1, 1 - (distFromCenter - screenW * 0.2) / maxDist));
          item.fx.style.opacity = distFromCenter < screenW * 0.3 ? '1' : opacity.toFixed(2);
        }
        return;
      }

      // Desktop optical formula - untouched!
      const trackLeft = track.getBoundingClientRect().left;

      for (let k = 0; k < measures.length; k++) {
        const item = measures[k];
        if (!item.fx) continue;

        const f = trackLeft + item.left;
        const H = Math.max(0, item.width - screenW);
        const E = computeThreshold(screenW, H);

        let S: number;
        if (f >= E) {
          S = f;
        } else if (f >= 0) {
          S = E * Math.pow(f / E, expPower);
        } else if (f >= -H) {
          S = 0;
        } else {
          const Z = -(f + H);
          S = Z <= E ? -E * Math.pow(Z / E, expPower) : f + H;
        }

        const delta = S - f;
        item.fx.style.transform = `translate3d(${delta}px, 0, 0)`;

        const normDist = Math.abs(S) / screenW;
        const blurAmount = Math.min(12, normDist * 22);
        const opacity = Math.max(0, Math.min(1, 1 - normDist * 1.25));

        item.fx.style.filter = blurAmount > 0.35 ? `blur(${blurAmount.toFixed(2)}px)` : '';
        item.fx.style.opacity = opacity.toFixed(3);
      }
    };

    measure();
    updateFx();

    const tween = gsap.to(track, {
      x: () => -getScrollDist(),
      ease: 'none',
      onUpdate: () => {
        updateFx();
      },
      scrollTrigger: {
        trigger: viewport,
        start: 'top top',
        end: () => `+=${getScrollDist()}`,
        pin: true,
        scrub: 0.45,
        anticipatePin: 0,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${self.progress})`;
          }
          updateFx();
        },
        onRefresh: () => {
          measure();
          updateFx();
        },
      },
    });

    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const onWindowResize = () => {
      const currentWidth = window.innerWidth;
      if (currentWidth !== lastWidth) {
        lastWidth = currentWidth;
        ScrollTrigger.refresh();
        measure();
        updateFx();
      }
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      tween.scrollTrigger?.kill();
      tween.kill();
      track.classList.remove('is-horizontal');
      delete document.documentElement.dataset.heroAxis;
    };
  }, []);

  return (
    <div ref={viewportRef} className="home__viewport">
      <div ref={trackRef} className="home__track">
        {/* Panel 1: Hero */}
        <section className="hpanel hpanel--bottom hpanel--hold">
          <div className="hpanel__pad hp-fx">
            <h1 className="hero__brand-title">
              <span className="hero__brand-dhaka">DHAKA</span>{' '}
              <span className="hero__brand-agency">AGENCY</span>
            </h1>
            <div className="hero__words">
              <span className="hero__word">
                Growth<span className="hero__dot hero__dot--gold">.</span>
              </span>{' '}
              <span className="hero__word">
                Strategy<span className="hero__dot hero__dot--teal">.</span>
              </span>{' '}
              <span className="hero__word">
                Scale<span className="hero__dot hero__dot--gold">.</span>
              </span>
            </div>
            <p className="hero__surtitle">
              Growth-Driven Digital Agency · Paid Ads · SEO Dominance · Web Engineering · CRO
            </p>
            <p className="hero__tagline" style={{ maxWidth: '640px', fontSize: '15px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.72)', margin: '0 0 16px' }}>
              Empowering businesses with data-driven SEO, High-ROI Paid Ads, custom Web Development, and Web Analytics. Built by experts, powered by data, designed to win.
            </p>
            <p className="hero__hint">
              Scroll to explore <span aria-hidden="true">→</span>
            </p>
          </div>
        </section>

        {/* Dynamic Project Panels with 3D Morph Shapes */}
        {PROJECTS_DATA.map((item, idx) => (
          <section
            key={idx}
            className="hpanel hpanel--bottom hpanel--hold"
            data-shape={item.shape}
          >
            <div className="hpanel__pad hp-fx">
              {item.tag && <p className="work__tag">{item.tag}</p>}
              <h2 className="work__name">{item.title}</h2>
              <div className="work__desc">
                {item.desc?.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
              {item.link && (
                <a href="#contact" className="work__link">
                  {item.link} <span className="work__arrow" aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </section>
        ))}

        {/* Tail panel for spacing */}
        <section className="hpanel hpanel--tail" aria-hidden="true" />
      </div>

      {/* Bottom Progress Bar */}
      <div className="home__progress" aria-hidden="true">
        <div ref={progressBarRef} className="home__progress-bar" />
      </div>
    </div>
  );
}
