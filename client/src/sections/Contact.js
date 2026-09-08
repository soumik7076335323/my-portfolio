import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { publicAPI, extractError } from '../services/api';
import SectionHeading from '../components/SectionHeading';
import { Reveal } from '../components/ui';
import { MailIcon, PhoneIcon, MapPinIcon, LinkedInIcon, GitHubIcon } from '../components/Icons';
import { isEmail } from '../utils/format';

const INITIAL = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { profile } = usePortfolio();
  const [form, setForm] = useState(INITIAL);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // {type:'ok'|'err', text}

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (form.name.trim().length < 2) return 'Please enter your name.';
    if (!isEmail(form.email)) return 'Please enter a valid email address.';
    if (form.subject.trim().length < 2) return 'Please add a subject.';
    if (form.message.trim().length < 10) return 'Message should be at least 10 characters.';
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ type: 'err', text: err });
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      await publicAPI.sendContact(form);
      setStatus({ type: 'ok', text: 'Message sent successfully. Thank you for reaching out — I will get back to you soon!' });
      setForm(INITIAL);
    } catch (error) {
      setStatus({ type: 'err', text: extractError(error, 'Could not send your message. Please try again or email me directly.') });
    } finally {
      setSending(false);
    }
  };

  const infoItems = [
    profile?.email && {
      icon: <MailIcon size={17} />,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile?.phone && {
      icon: <PhoneIcon size={17} />,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s+/g, '')}`,
    },
    profile?.location && {
      icon: <MapPinIcon size={17} />,
      label: 'Location',
      value: profile.location,
    },
    profile?.linkedin && {
      icon: <LinkedInIcon size={17} />,
      label: 'LinkedIn',
      value: 'Connect with me',
      href: profile.linkedin,
    },
    profile?.github && {
      icon: <GitHubIcon size={17} />,
      label: 'GitHub',
      value: 'Follow my work',
      href: profile.github,
    },
  ].filter(Boolean);

  return (
    <section className="section" id="contact">
      <div className="container">
        <Reveal>
          <SectionHeading
            index="07"
            kicker="contact"
            title="Let's build something together"
            sub="Have a role, project or idea in mind? My inbox is always open."
          />
        </Reveal>

        <div className="contact-grid">
          <Reveal>
            <div className="contact-info-list">
              {infoItems.map((item) => {
                const inner = (
                  <>
                    <span className="ico" aria-hidden="true">{item.icon}</span>
                    <span>
                      <span className="lbl">{item.label}</span>
                      <span>{item.value}</span>
                    </span>
                  </>
                );
                return item.href ? (
                  <a
                    className="contact-info-item"
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="contact-info-item" key={item.label}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal style={{ transitionDelay: '0.1s' }}>
            <form className="contact-form-card" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="cf-name">
                    Name <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-name"
                    className="input"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={onChange}
                    maxLength={100}
                    autoComplete="name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="cf-email">
                    Email <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-email"
                    className="input"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    maxLength={160}
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="cf-subject">
                  Subject <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  id="cf-subject"
                  className="input"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={form.subject}
                  onChange={onChange}
                  maxLength={200}
                />
              </div>
              <div className="field">
                <label htmlFor="cf-message">
                  Message <span className="req" aria-hidden="true">*</span>
                </label>
                <textarea
                  id="cf-message"
                  className="textarea"
                  name="message"
                  placeholder="Tell me about the role or project…"
                  value={form.message}
                  onChange={onChange}
                  maxLength={5000}
                />
              </div>

              <button type="submit" className={`btn btn-primary ${sending ? 'loading' : ''}`} disabled={sending}>
                {sending && <span className="spinner" aria-hidden="true" />}
                {sending ? 'Sending…' : 'Send Message'}
              </button>

              {status && (
                <p className={`form-status ${status.type}`} role="alert">
                  {status.text}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
