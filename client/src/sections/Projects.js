import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import { Reveal, EmptyState } from '../components/ui';
import { GitHubIcon, ExternalLinkIcon, EyeIcon, FolderIcon } from '../components/Icons';


function LinkButton({ href, icon, children, primary }) {
  if (!href) return null;
  const cls = primary ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {icon} {children}
      </a>
    );
  }
  return (
    <a className={cls} href={href}>
      {icon} {children}
    </a>
  );
}

function ProjectVisual({ project }) {
  if (project.imageUrl) {
    return (
      <img
        src={project.imageUrl}
        alt={`${project.name} preview`}
        loading="lazy"
      />
    );
  }
  return (
    <div className="project-visual-fallback">
      <span className="glyph" aria-hidden="true">⌘</span>
      <p className="code">
        $ npm run build
        <br />
        compiled successfully ✓
      </p>
    </div>
  );
}

export default function Projects() {
  const { projects } = usePortfolio();

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  if (projects.length === 0) {
    return (
      <section className="section" id="projects">
        <div className="container">
          <Reveal>
            <SectionHeading index="04" kicker="projects" title="Things I've built" />
          </Reveal>
          <EmptyState>Projects will appear here soon.</EmptyState>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="projects">
      <div className="container">
        <Reveal>
          <SectionHeading
            index="04"
            kicker="projects"
            title="Things I've built"
            sub="Real applications, deployed and running in production."
          />
        </Reveal>

        <div className="project-list">
          {featured.map((project) => (
            <Reveal key={project._id}>
              <article className="project-card featured">
                <div className="project-layout">
                  <div className="project-visual">
                    <span className="featured-badge">FEATURED PROJECT</span>
                    <ProjectVisual project={project} />
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-sub">{project.shortDescription}</p>

                    {project.techStack?.length > 0 && (
                      <div className="project-tech">
                        {project.techStack.map((t) => (
                          <span className="skill-tag" key={t}>{t}</span>
                        ))}
                      </div>
                    )}

                    {project.features?.length > 0 && (
                      <ul className="project-features">
                        {project.features.slice(0, 8).map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}

                    <div className="project-links">
                      <LinkButton href={project.links?.live} icon={<ExternalLinkIcon size={14} />} primary>
                        Live Demo
                      </LinkButton>
                      <LinkButton href={project.links?.admin} icon={<EyeIcon size={14} />}>
                        Admin Panel
                      </LinkButton>
                      <LinkButton href={project.links?.github} icon={<GitHubIcon size={14} />}>
                        GitHub
                      </LinkButton>
                      <LinkButton href={project.links?.backend} icon={<FolderIcon size={14} />}>
                        Backend API
                      </LinkButton>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="project-grid" style={{ marginTop: 26 }}>
            {rest.map((project, i) => (
              <Reveal key={project._id} style={{ transitionDelay: `${Math.min(i * 0.06, 0.2)}s` }}>
                <article className="project-card compact" style={{ height: '100%' }}>
                  <div className="project-body">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-sub">{project.shortDescription}</p>
                    {project.techStack?.length > 0 && (
                      <div className="project-tech">
                        {project.techStack.map((t) => (
                          <span className="skill-tag" key={t}>{t}</span>
                        ))}
                      </div>
                    )}
                    {project.features?.length > 0 && (
                      <ul className="project-features" style={{ gridTemplateColumns: '1fr' }}>
                        {project.features.slice(0, 4).map((f, j) => (
                          <li key={j}>{f}</li>
                        ))}
                      </ul>
                    )}
                    <div className="project-links">
                      <LinkButton href={project.links?.live} icon={<ExternalLinkIcon size={14} />} primary>
                        Live Demo
                      </LinkButton>
                      <LinkButton href={project.links?.github} icon={<GitHubIcon size={14} />}>
                        GitHub
                      </LinkButton>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
