import { useState, useEffect } from 'react';
import { initGA, initClarity } from '@/lib/analytics';

const CONSENT_KEY = 'db_workouts_cookie_consent';

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    if (consent === 'accepted') {
      initGA();
      initClarity();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    initGA();
    initClarity();
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#18181b',
        borderTop: '1px solid #3f3f46',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'space-between',
      }}
    >
      <p style={{ margin: 0, color: '#d4d4d8', fontSize: '14px', maxWidth: '680px', lineHeight: '1.5' }}>
        We use analytics cookies (Google Analytics &amp; Microsoft Clarity) to understand how people use our tools and improve them.
        Your calculator inputs stay on your device only.{' '}
        <a href="https://dbworkouts.co.uk/privacy-policy" target="_blank" rel="noopener" style={{ color: '#B30018' }}>
          Privacy Policy
        </a>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #52525b',
            background: 'transparent',
            color: '#a1a1aa',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#B30018',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
