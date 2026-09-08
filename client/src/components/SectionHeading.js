import React from 'react';

export default function SectionHeading({ index, kicker, title, sub }) {
  return (
    <div className="section-heading">
      <span className="kicker">
        {index ? `${index}. ` : ''}
        {kicker}
      </span>
      <h2>{title}</h2>
      {sub ? <p className="sub">{sub}</p> : null}
    </div>
  );
}
