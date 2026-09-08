import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import SectionHeading from '../components/SectionHeading';
import { Reveal } from '../components/ui';

/** Category glyphs (pure CSS/emoji-free, mono letters). */
const CATEGORY_ICONS = {
  Frontend: 'UI',
  Backend: 'API',
  Database: 'DB',
  'Authentication & Security': 'SEC',
  'Payment & Uploads': 'PAY',
  'Developer Tools': 'DEV',
  Deployment: 'OPS',
};

export default function Skills() {
  const { skillGroups } = usePortfolio();

  return (
    <section className="section" id="skills">
      <div className="container">
        <Reveal>
          <SectionHeading
            index="02"
            kicker="skills"
            title="Tools I build with"
            sub="The stack behind my production work — grouped the way I actually use it, from interface to infrastructure."
          />
        </Reveal>

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <Reveal
              className="skill-card"
              key={group.category}
              style={{ transitionDelay: `${Math.min(i * 0.05, 0.3)}s` }}
            >
              <div className="skill-card-head">
                <span className="ico" aria-hidden="true">
                  {CATEGORY_ICONS[group.category] || group.category.slice(0, 3).toUpperCase()}
                </span>
                <h3>{group.category}</h3>
              </div>
              <div className="skill-tags">
                {group.items.map((s) => (
                  <span className="skill-tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
