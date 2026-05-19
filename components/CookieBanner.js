'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const accepted = localStorage.getItem('ig_cookies');
        if (!accepted) setVisible(true);
      } catch {
        // localStorage not available
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem('ig_cookies', 'accepted');
    } catch {}
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem('ig_cookies', 'declined');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="region" aria-label="Cookie consent">
      <p className="cookie-text">
        We use cookies to improve your experience and analyse traffic. By using
        indiagrowth.in, you agree to our{' '}
        <Link href="/cookie-policy">Cookie Policy</Link> and{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
      <div className="cookie-actions">
        <button className="cookie-decline" onClick={decline}>
          Decline
        </button>
        <button className="cookie-accept" onClick={accept}>
          Accept All
        </button>
      </div>
    </div>
  );
}
