import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import { Reveal, EmptyState } from '../components/ui';

export function Education() {
  const { education } = usePortfolio();

  return (
    <div>
      <Reveal>
        <SectionHeading index="05" kicker="education" title="Where I studied" />
      </Reveal>
      {education.length === 0 ? (
        <EmptyState>Education details will appear here soon.</EmptyState>
      ) : (
        education.map((edu, i) => (
          <Reveal className="edu-card" key={edu._id || i}>
            <h3 className="edu-degree">
              {edu.degree}
              {edu.field && !edu.degree.includes(edu.field) ? ` — ${edu.field}` : ''}
            </h3>
            <div className="edu-inst">{edu.institution}</div>
            <div className="edu-meta">
              {(edu.startYear || edu.endYear) && (
                <span className="edu-pill">
                  {edu.startYear}
                  {edu.startYear && edu.endYear ? ' – ' : ''}
                  {edu.endYear}
                </span>
              )}
              {edu.cgpa && <span className="edu-pill">CGPA: {edu.cgpa}</span>}
            </div>
            {edu.description && (
              <p style={{ marginTop: 14, color: 'var(--muted)', fontSize: '0.92rem' }}>
                {edu.description}
              </p>
            )}
          </Reveal>
        ))
      )}
    </div>
  );
}

export function Certifications() {
  const { certifications } = usePortfolio();

  return (
    <div>
      <Reveal>
        <SectionHeading index="06" kicker="certifications" title="Certified skills" />
      </Reveal>
      {certifications.length === 0 ? (
        <EmptyState>Certifications will appear here soon.</EmptyState>
      ) : (
        <div className="cert-list">
          {certifications.map((cert, i) => (
            <Reveal className="cert-item" key={cert._id || i} style={{ transitionDelay: `${Math.min(i * 0.05, 0.2)}s` }}>
              <span className="badge" aria-hidden="true">✓</span>
              <div>
                <div className="name">{cert.name}</div>
                <div className="meta">
                  {[cert.issuer, cert.year].filter(Boolean).join(' · ') || 'Certification'}
                </div>
              </div>
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                  View ↗
                </a>
              )}
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/** Combined section wrapper for education + certifications. */
export default function EducationAndCertifications() {
  return (
    <section className="section section-alt" id="education">
      <div className="container">
        <div className="edu-cert-grid">
          <Education />
          <Certifications />
        </div>
      </div>
    </section>
  );
}
