import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { publicAPI } from '../services/api';

const PortfolioContext = createContext(null);

const initial = {
  profile: null,
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  settings: null,
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profile, skills, experience, projects, education, certifications, settings] =
        await Promise.all([
          publicAPI.getProfile(),
          publicAPI.getSkills(),
          publicAPI.getExperience(),
          publicAPI.getProjects(),
          publicAPI.getEducation(),
          publicAPI.getCertifications(),
          publicAPI.getSettings(),
        ]);
      setData({
        profile: profile.data.data,
        skills: skills.data.data || [],
        experience: experience.data.data || [],
        projects: projects.data.data || [],
        education: education.data.data || [],
        certifications: certifications.data.data || [],
        settings: settings.data.data,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not load portfolio content. Is the API server running?'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the browser tab title / meta description in sync with settings
  useEffect(() => {
    if (data.settings?.seoTitle) document.title = data.settings.seoTitle;
    if (data.settings?.seoDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', data.settings.seoDescription);
    }
  }, [data.settings]);

  const skillGroups = (() => {
    const order = [
      'Frontend',
      'Backend',
      'Database',
      'Authentication & Security',
      'Payment & Uploads',
      'Developer Tools',
      'Deployment',
    ];
    const map = new Map();
    data.skills.forEach((s) => {
      const cat = s.category || 'Other';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(s.name);
    });
    const keys = [...map.keys()].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    return keys.map((k) => ({ category: k, items: map.get(k) }));
  })();

  return (
    <PortfolioContext.Provider value={{ ...data, skillGroups, loading, error, reload: load }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
