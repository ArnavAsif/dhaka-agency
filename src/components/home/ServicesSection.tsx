'use client';

import React, { useEffect, useRef } from 'react';

const ROW_A = [
  'Artificial Intelligence',
  'AI agents & LLMs',
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'WebGL · Three.js',
  'GSAP',
];

const ROW_B = [
  'Headless CMS · Strapi',
  'Micro-service architecture',
  'APIs & integrations',
  'Jamstack · SSG',
  'Motion design',
  'Cinema 4D',
  'Video production',
  'Art direction',
  'UI/UX design',
];

export function ServicesSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!root || !t1 || !t2) return;

    let pos1 = 0;
    let pos2 = 0;
    let speedMult = 1;
    let targetSpeed = 1;
    let isHovered = false;
    let animId = 0;
    let lastTime = performance.now();

    const onPointerEnter = () => {
      isHovered = true;
      targetSpeed = 4;
    };
    const onPointerLeave = () => {
      isHovered = false;
      targetSpeed = 1;
    };

    root.addEventListener('pointerenter', onPointerEnter);
    root.addEventListener('pointerleave', onPointerLeave);

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      speedMult += (targetSpeed - speedMult) * (1 - Math.exp(-2.5 * delta));

      const w1 = t1.scrollWidth / 2 || 1;
      const w2 = t2.scrollWidth / 2 || 1;

      const baseSpeed = 50; // pixels per second
      pos1 -= baseSpeed * speedMult * delta;
      pos2 += baseSpeed * speedMult * delta;

      if (pos1 <= -w1) pos1 += w1;
      if (pos2 >= 0) pos2 -= w2;

      t1.style.transform = `translateX(${pos1}px)`;
      t2.style.transform = `translateX(${pos2}px)`;
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      root.removeEventListener('pointerenter', onPointerEnter);
      root.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <section id="agency" className="services">
      <div className="services__head">
        <p className="services__kicker">Our expertise</p>
        <h2 className="services__title">
          What we do best<span className="services__dot">.</span>
        </h2>
      </div>

      <div ref={rootRef} className="marquee">
        {/* Row 1 */}
        <div className="marquee__row">
          <div ref={track1Ref} className="marquee__track">
            {[...ROW_A, ...ROW_A, ...ROW_A, ...ROW_A].map((item, idx) => (
              <span key={`rowA-${idx}`} className="mq">
                {item}
                <span className="mq__plus" aria-hidden="true">+</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 (Outline typography) */}
        <div className="marquee__row">
          <div ref={track2Ref} className="marquee__track">
            {[...ROW_B, ...ROW_B, ...ROW_B, ...ROW_B].map((item, idx) => (
              <span key={`rowB-${idx}`} className="mq mq--outline">
                {item}
                <span className="mq__plus mq__plus--teal" aria-hidden="true">+</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
