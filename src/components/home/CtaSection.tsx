'use client';

import React from 'react';

export function CtaSection() {
  return (
    <section id="contact" className="cta">
      <div className="cta__inner">
        <p className="services__kicker" style={{ marginBottom: '16px' }}>Get In Touch</p>
        <h2 className="cta__title">
          Let&apos;s Build Something Amazing Together
          <span className="cta__accent">.</span>
        </h2>
        <p style={{ marginTop: '20px', fontSize: '18px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: '1.6', maxWidth: '640px', marginInline: 'auto' }}>
          Ready to take your business to the next level? We&apos;re here to turn your digital vision into high-performing reality.
        </p>
        <div className="cta__actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <a
            href="mailto:nomaddigitalbd@gmail.com"
            className="btn btn--gold"
          >
            <span className="btn__label">Request Free Quotation</span>
          </a>
          <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.55)', letterSpacing: '0.05em' }}>
            We&apos;ll respond within 24 hours · Dhaka, Bangladesh
          </span>
        </div>
      </div>
    </section>
  );
}
