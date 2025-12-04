// src/components/MentorFilters.jsx
import React, { useState } from 'react';

export default function MentorFilters({ onChange }) {
  const [q, setQ] = useState('');
  const [skills, setSkills] = useState('');
  const [minExp, setMinExp] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('rating');

  const apply = () => {
    const filters = {};
    if (q) filters.q = q;
    if (skills) filters.skills = skills;
    if (minExp) filters.minExp = minExp;
    if (location) filters.location = location;
    if (sort) filters.sort = sort;
    onChange(filters);
  };

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input placeholder="Search mentors (headline, bio)" value={q} onChange={e => setQ(e.target.value)} />
      <input placeholder="Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} />
      <input placeholder="Min experience (years)" type="number" value={minExp} onChange={e => setMinExp(e.target.value)} />
      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="rating">Top rated</option>
        <option value="experienceYears">Most experienced</option>
        <option value="createdAt">Newest</option>
      </select>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={apply}>Apply</button>
        <button onClick={() => { setQ(''); setSkills(''); setMinExp(''); setLocation(''); setSort('rating'); onChange({}); }}>Reset</button>
      </div>
    </div>
  );
}
