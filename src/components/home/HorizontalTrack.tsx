'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
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
    tag: '18 years already…',
    title: 'BIC × Agence F+',
    desc: [
      '2026 marked the 18th year of the partnership between the BIC Group and Agence F+! A solid partnership, unique in our field, symbolising deep mutual trust and a shared vision.',
      'In 2026 once again, the BIC Group entrusted us with foundational, large-scale projects, reflecting Agence F+\'s position as a go-to agency for the BIC Group. Quite simply: THANK YOU!',
    ],
  },
  {
    shape: 'glasses',
    tag: 'Art direction',
    title: 'Saint Laurent',
    desc: [
      'Agence F+ supported the House of Saint Laurent, a flagship of the Kering Group, on a critical, global-scale e-learning project.',
      'We brought our instructional design expertise and creativity to professional training at Saint Laurent.',
    ],
    link: 'View project',
  },
  {
    shape: 'wheel',
    tag: 'Event platform · Corporate site',
    title: 'Groupauto International',
    desc: [
      'COVID severely disrupted the organisation of events. With that in mind, in partnership with the agency Collectif Ensemble, we developed a fully automated digital platform for online events, to enable Groupauto International, a leader in the Automotive Aftermarket, to keep holding its meetings and closing its deals.',
      'Built on a micro-services foundation, the platform runs on Strapi and Nuxt.js. More than 3,500 meetings/deals were organised across the world.',
    ],
    link: 'View project',
  },
  {
    shape: 'pen',
    tag: 'Corporate site · Strapi + Nuxt.js',
    title: 'Groupe BIC',
    desc: [
      'Discover the new corporate website of the BIC Group, designed and developed by Agence F+. Using Strapi and Nuxt.js, this multilingual, global-scale site replaces a previous site that had become dated both visually and technically. Our expertise in digital strategy and development guided every step: a clean, simple interface true to the BIC brand\'s DNA, and a very easy-to-use admin interface.',
    ],
    link: 'View project',
  },
  {
    shape: 'bottle',
    tag: 'Audiovisual · PepsiCo Group',
    title: 'Tropicana',
    desc: [
      'Tropicana (PepsiCo Group) called on Agence F+\'s audiovisual expertise. Our mission: to create a series of internal films presented at the group\'s marketing conventions.',
      'Through these videos, Tropicana showcased its latest innovations and marketing strategies for the years ahead to its teams.',
    ],
    link: 'View project',
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
            <h1 className="hero__logo">
              <Image
                src="/images/logo-ondark.png"
                alt="Agence F+ — communication, AI, development"
                width={2157}
                height={526}
                priority
              />
            </h1>
            <div className="hero__words">
              <span className="hero__word">
                Imagine<span className="hero__dot hero__dot--gold">.</span>
              </span>{' '}
              <span className="hero__word">
                Build<span className="hero__dot hero__dot--teal">.</span>
              </span>{' '}
              <span className="hero__word">
                Launch<span className="hero__dot hero__dot--gold">.</span>
              </span>
            </div>
            <p className="hero__surtitle">
              Communication agency · AI · Development · Digital strategy
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
