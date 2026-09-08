import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import { Reveal, EmptyState } from '../components/ui';

export default function Experience() {
  const { experience } = usePortfolio();

  return (
    <section className="section section-alt" id="experience">
      <div className="container">
        <Reveal>
          <SectionHeading
            index="03"
            kicker="experience"
            title="Where I've worked"
            sub="Two-plus years shipping production software — from an online shopping platform backend to freelance MERN delivery."
          />
        </Reveal>

        {experience.length === 0 ? (
          <EmptyState>Experience will appear here soon.</EmptyState>
        ) : (
          <div className="timeline">
            {experience.map((job, i) => (
              <Reveal className="timeline-item" key={job._id || i} style={{ transitionDelay: `${Math.min(i * 0.06, 0.24)}s` }}>
                <span className="timeline-dot" aria-hidden="true" />
                <article className="timeline-card">
                  <div className="timeline-head">
                    <div>
                      <h3 className="timeline-role">{job.position}</h3>
                      <div className="timeline-company">
                        {job.company}
                        {job.employmentType ? <span className="timeline-type"> · {job.employmentType}</span> : null}
                      </div>
                    </div>
                    <span className="timeline-date">
                      {job.startDate} — {job.endDate || 'Present'}
                    </span>
                  </div>
                  {job.description?.length > 0 && (
                    <ul className="timeline-desc">
                      {job.description.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  )}
                  {job.technologies?.length > 0 && (
                    <div className="timeline-tech">
                      {job.technologies.map((t) => (
                        <span className="skill-tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
