import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { resolveUrl } from '../services/api';
import { Reveal } from '../components/ui';
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from '../components/Icons';

const FALLBACK_PHOTO = `${process.env.PUBLIC_URL || ''}/images/profile.jpg`;

export default function Hero() {
  const { profile, settings, loading } = usePortfolio();

  const photoUrl = profile?.photoUrl ? resolveUrl(profile.photoUrl) : FALLBACK_PHOTO;
  const resumeHref = profile?.resumeUrl ? resolveUrl(profile.resumeUrl) : null;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <section className="hero" id="home">
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="container hero-inner">
          <div>
            <Reveal>
              <p className="hero-greeting">Hello, I'm</p>
            </Reveal>
            <Reveal as="h1" className="hero-name">
              {loading && !profile ? (
                <span className="skel" style={{ display: 'inline-block', width: 'min(430px, 80%)', height: '0.9em' }} />
              ) : (
                profile?.name || 'Soumik Adhikary'
              )}
            </Reveal>
            <Reveal className="hero-title" style={{ transitionDelay: '0.07s' }}>
              <span>{profile?.title || 'Full Stack MERN Developer'}</span>
              <span className="cursor" aria-hidden="true" />
            </Reveal>
            <Reveal as="p" className="hero-tagline" style={{ transitionDelay: '0.14s' }}>
              {profile?.tagline ||
                'Building scalable, secure and data-driven web applications with the MERN stack — from React interfaces to REST APIs, authentication and cloud deployment.'}
            </Reveal>

            <Reveal className="hero-cta" style={{ transitionDelay: '0.2s' }}>
              <button type="button" className="btn btn-primary" onClick={() => scrollTo('projects')}>
                View My Work
              </button>
              {resumeHref ? (
                <a className="btn btn-outline" href={resumeHref} download>
                  <DownloadIcon size={16} /> Download Resume
                </a>
              ) : (
                <button type="button" className="btn btn-outline" disabled>
                  <DownloadIcon size={16} /> Resume coming soon
                </button>
              )}
            </Reveal>

            <Reveal className="hero-socials" style={{ transitionDelay: '0.26s' }}>
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                  <GitHubIcon className="icon" /> GitHub
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                  <LinkedInIcon className="icon" /> LinkedIn
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} aria-label="Send email">
                  <MailIcon className="icon" /> Email
                </a>
              )}
            </Reveal>
          </div>

          <Reveal className="hero-photo-wrap" style={{ transitionDelay: '0.15s' }}>
            <div className="hero-photo-card">
              <div className="hero-photo-frame">
                <img
                  src={photoUrl}
                  alt={`${profile?.name || 'Soumik Adhikary'} — Full Stack MERN Developer`}
                  loading="eager"
                  fetchpriority="high"
                  onError={(e) => {
                    if (!e.currentTarget.src.endsWith(FALLBACK_PHOTO)) {
                      e.currentTarget.src = FALLBACK_PHOTO;
                    }
                  }}
                />
              </div>
            </div>

            <span className="hero-available">
              <span className="pulse" aria-hidden="true" /> Open to opportunities
            </span>

            {/* Developer stack chips — the MERN orbit */}
            <span className="mern-chip" aria-hidden="true"><span className="cdot" /> MERN</span>
            <span className="mern-chip" aria-hidden="true"><span className="cdot" /> MongoDB</span>
            <span className="mern-chip" aria-hidden="true"><span className="cdot" /> Express</span>
            <span className="mern-chip" aria-hidden="true"><span className="cdot" /> React</span>
            <span className="mern-chip" aria-hidden="true"><span className="cdot" /> Node.js</span>
          </Reveal>
        </div>
      </section>

      {settings?.showBuildShipScale !== false && (
        <div className="bss-strip" aria-label="How I work">
          <div className="container bss-inner">
            {(settings?.buildShipScale?.length
              ? settings.buildShipScale
              : [
                  { label: 'BUILD', detail: 'React UIs & REST APIs' },
                  { label: 'SHIP', detail: 'Tested & integrated releases' },
                  { label: 'SCALE', detail: 'Cloud-deployed & data-driven' },
                ]
            ).map((step) => (
              <div className="bss-step" key={step.label}>
                <span className="bss-label">{step.label}</span>
                <span className="bss-detail">{step.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
