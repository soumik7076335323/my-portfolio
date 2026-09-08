import React from 'react';

/** Shared small UI primitives for public + admin. */

export function Reveal({ children, as: Tag = 'div', className = '', ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      el.classList.add('revealed');
      return undefined;
    }
    el.classList.add('reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

export function EmptyState({ glyph = '∅', children }) {
  return (
    <div className="empty-state">
      <div className="glyph">{glyph}</div>
      <p>{children}</p>
    </div>
  );
}

export function PageLoading({ label = 'loading…' }) {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <div className="loader-ring" />
      <span>{label}</span>
    </div>
  );
}

export function SectionSkeleton({ height = 220 }) {
  return (
    <div className="section-skeleton" aria-hidden="true">
      <div className="skel" style={{ height: 22, width: 180, marginBottom: 18 }} />
      <div className="skel" style={{ height, width: '100%' }} />
    </div>
  );
}
