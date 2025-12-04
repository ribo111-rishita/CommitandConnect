// MentorGrid.jsx
import React from 'react';
import MentorCard from './MentorCard';

export default function MentorGrid({ profiles = [], onRequested, onOpenChat }) {
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',
      gap:16
    }}>
      {profiles.map(p => (
        <MentorCard key={p.id} mentor={p} onRequested={onRequested} onOpenChat={onOpenChat} />
      ))}
    </div>
  );
}
