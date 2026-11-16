'use client';

import React from 'react';

export function CtaSection() {
  return (
    <section id="contact" className="cta">
      <div className="cta__inner">
        <h2 className="cta__title">
          What if the next project were yours
          <span className="cta__accent">?</span>
        </h2>
        <div className="cta__actions">
          <a
            href="mailto:at@fplusagency.com"
            className="btn btn--gold"
          >
            <span className="btn__label">Start a project</span>
          </a>
        </div>
      </div>
    </section>
  );
}
