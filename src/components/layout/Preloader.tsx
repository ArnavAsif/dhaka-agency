'use client';

import React, { useEffect, useState } from 'react';

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
      setTimeout(() => {
        setRemoved(true);
      }, 700);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (removed) return null;

  return (
    <div
      className={`loader ${hidden ? 'loader--hidden' : ''}`}
      aria-hidden="true"
    >
      <div className="loader__aura" />
      <div className="loader__stage">
        <div className="loader__brand-title">
          <span className="loader__brand-dhaka">DHAKA</span>{' '}
          <span className="loader__brand-agency">AGENCY</span>
        </div>
        <div className="loader__tag">Experts for Global Business Growth</div>
        <div className="loader__bar">
          <div className="loader__comet" />
        </div>
      </div>
    </div>
  );
}
