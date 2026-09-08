import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { resolveUrl } from '../services/api';
import { GitHubIcon, LinkedInIcon, MailIcon, DownloadIcon } from './Icons';

export default function Footer() {
  const { profile, settings } = usePortfolio();
  if (!profile) return null;

  const resumeHref = profile.resumeUrl ? resolveUrl(profile.resumeUrl) : '#';
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="name">{profile.name || 'Soumik Adhikary'}</div>
            <div className="role">{profile.title || 'Full Stack MERN Developer'}</div>
            <p className="note">{settings?.footerNote || 'Designed & built with the MERN stack.'}</p>
            {resumeHref !== '#' && (
              <div style={{ marginTop: 18 }}>
                <a className="btn btn-outline btn-sm" href={resumeHref} download>
                  <DownloadIcon size={15} /> Download Resume
                </a>
              </div>
            )}
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About</a></li>
                <li><a href="#skills" onClick={(e) => { e.preventDefault(); document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }); }}>Skills</a></li>
                <li><a href="#experience" onClick={(e) => { e.preventDefault(); document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }); }}>Experience</a></li>
                <li><a href="#projects" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>Projects</a></li>
                <li><Link to="/admin/login">Admin</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                {profile.github && (
                  <li>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <GitHubIcon size={15} /> GitHub
                      </span>
                    </a>
                  </li>
                )}
                {profile.linkedin && (
                  <li>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <LinkedInIcon size={15} /> LinkedIn
                      </span>
                    </a>
                  </li>
                )}
                {profile.email && (
                  <li>
                    <a href={`mailto:${profile.email}`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <MailIcon size={15} /> Email
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {profile.name || 'Soumik Adhikary'}. All rights reserved.
          </span>
          <span className="mono">
            built with <span className="hrt">♥</span> + MERN
          </span>
        </div>
      </div>
    </footer>
  );
}
