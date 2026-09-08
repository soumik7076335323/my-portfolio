import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import { Reveal } from '../components/ui';
import { GitHubIcon, LinkedInIcon } from '../components/Icons';

/** Turns the professional summary into a scannable two-paragraph about. */
const splitSummary = (summary = '') => {
  const sentences = summary.match(/[^.!?]+[.!?]+/g) || [summary];
  if (sentences.length <= 2) return [summary];
  const first = sentences.slice(0, Math.ceil(sentences.length / 2)).join(' ').trim();
  const rest = sentences.slice(Math.ceil(sentences.length / 2)).join(' ').trim();
  return [first, rest];
};

export default function About() {
  const { profile } = usePortfolio();
  if (!profile) return null;

  const paras = splitSummary(profile.summary);

  return (
    <section className="section section-alt" id="about">
      <div className="container">
        <Reveal>
          <SectionHeading
            index="01"
            kicker="about"
            title="A developer who owns the full picture"
          />
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-text">
            {paras.map((p, i) => (
              <p key={i}>
                {i === 0 ? (
                  <>
                    <strong>Full Stack MERN Developer</strong> — {p.replace(/^Full Stack MERN Developer with\s*/i, '')}
                  </>
                ) : (
                  p
                )}
              </p>
            ))}
          </Reveal>

          <Reveal className="about-cards" style={{ transitionDelay: '0.1s' }}>
            <div className="about-card">
              <div className="label">Core Stack</div>
              <div className="value">React.js · Node.js · Express.js · MongoDB · MySQL</div>
            </div>
            <div className="about-card">
              <div className="label">What I Do</div>
              <div className="value">
                REST API development · JWT Authentication · RBAC · Stripe payments · File uploads ·
                Responsive UI
              </div>
            </div>
            <div className="about-card">
              <div className="label">Deployment</div>
              <div className="value">Vercel · Render · MongoDB Atlas</div>
            </div>
            <div className="about-card">
              <div className="label">Find Me</div>
              <div className="value" style={{ display: 'flex', gap: 18 }}>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <GitHubIcon size={16} /> GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <LinkedInIcon size={16} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
