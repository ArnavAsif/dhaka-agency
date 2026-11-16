'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
        <Image
          src="/images/logo-ondark.png"
          alt="Agence F+"
          className="loader__logo"
          width={214}
          height={52}
          priority
        />
        <div className="loader__tag">Imagine · Build · Launch</div>
        <div className="loader__bar">
          <div className="loader__comet" />
        </div>
      </div>
    </div>
  );
}
