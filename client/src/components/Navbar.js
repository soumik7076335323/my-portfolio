import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { usePortfolio } from "../context/PortfolioContext";
import { resolveUrl } from "../services/api";
import { SunIcon, MoonIcon, DownloadIcon } from "./Icons";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const { theme, toggleTheme } = useTheme();
  const { profile, loading } = usePortfolio();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the section currently in view for nav highlighting
  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-38% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]); // re-attach once async sections have mounted

  // Close the mobile menu when leaving to admin routes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const resumeHref = profile?.resumeUrl ? resolveUrl(profile.resumeUrl) : "#";

  const goTo = (href) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link
            to="/"
            className="nav-logo"
            aria-label="Home"
            onClick={() => setOpen(false)}
          >
            Soumik<span className="dot">.</span>Porfolio
          </Link>

          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={goTo(l.href)}
                    className={active === l.href ? "active" : ""}
                    aria-current={active === l.href ? "true" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon size={17} />
              ) : (
                <MoonIcon size={17} />
              )}
            </button>
            {resumeHref !== "#" ? (
              <a className="btn btn-primary btn-sm" href={resumeHref} download>
                <DownloadIcon size={15} /> Resume
              </a>
            ) : (
              <span
                className="btn btn-primary btn-sm"
                style={{ opacity: 0.5, pointerEvents: "none" }}
              >
                <DownloadIcon size={15} /> Resume
              </span>
            )}
            <button
              type="button"
              className={`nav-burger ${open ? "open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={goTo(l.href)} tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="resume-link"
              href={resumeHref !== "#" ? resumeHref : undefined}
              download
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              style={
                resumeHref === "#"
                  ? { opacity: 0.5, pointerEvents: "none" }
                  : undefined
              }
            >
              ↓ Download Resume
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
