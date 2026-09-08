import React from 'react';
import { PortfolioProvider, usePortfolio } from '../context/PortfolioContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Experience from '../sections/Experience';
import Projects from '../sections/Projects';
import EducationAndCertifications from '../sections/EducationCertifications';
import Contact from '../sections/Contact';
import { PageLoading } from '../components/ui';

function PortfolioPage() {
  const { loading, error, reload } = usePortfolio();

  if (error) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 'var(--nav-h)' }}>
          <div className="error-banner">
            <div className="glyph" aria-hidden="true">⚠</div>
            <h3>Portfolio content couldn't load</h3>
            <p>
              {error} — make sure the API server is running on port 5000 (or that
              REACT_APP_API_URL points to your deployed backend).
            </p>
            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={reload}>
                Try again
              </button>
              <a className="btn btn-outline" href="mailto:adhikarysoumik97@gmail.com">
                Email me directly
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {loading ? (
          <PageLoading label="loading portfolio…" />
        ) : (
          <>
            <About />
            <Skills />
            <Experience />
            <Projects />
            <EducationAndCertifications />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <PortfolioProvider>
      <PortfolioPage />
    </PortfolioProvider>
  );
}
