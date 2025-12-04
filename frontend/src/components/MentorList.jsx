import React from 'react';
import MentorCard from './MentorCard';

export default function MentorList({ profiles = [] }) {
  if (!profiles.length) return <p>No mentors found.</p>;
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12}}>
      {profiles.map(p => (
        <MentorCard key={p._id} mentor={p} />
      ))}
    </div>
  );
}
