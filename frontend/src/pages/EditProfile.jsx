// src/pages/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditProfile() {
  const { id } = useParams(); // optional profile id
  const nav = useNavigate();
  const [form, setForm] = useState({
    headline:'', bio:'', skills: '', experienceYears: 0, availability: { days: [], hours: '', timezone: '' }, location: ''
  });

  useEffect(()=> {
    // If editing a profile by id, load it
    if (id) {
      api.get(`/mentors/profile/${id}`).then(r => {
        const p = r.data;
        setForm({
          headline: p.headline || '',
          bio: p.bio || '',
          skills: (p.skills || []).join(', '),
          experienceYears: p.experienceYears || 0,
          availability: p.availability || { days: [], hours: '', timezone: '' },
          location: p.location || ''
        });
      }).catch(()=>{});
    } else {
      // if no id, try fetching current user's profile to prefill
      api.get('/mentors/me').then(r => {
        // this returns user object. To fetch own profile, call the profiles endpoint filtered by userId or create endpoint
      }).catch(()=>{});
    }
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      headline: form.headline,
      bio: form.bio,
      skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean),
      experienceYears: Number(form.experienceYears),
      availability: form.availability,
      location: form.location
    };
    try {
      const res = await api.post('/mentors/profile', payload);
      alert('Saved');
      nav('/dashboard');
    } catch (err) {
      alert('Save failed');
    }
  };

  return (
    <div className="card">
      <h2>Edit Mentor Profile</h2>
      <form onSubmit={handleSave}>
        <input value={form.headline} onChange={e=>setForm({...form, headline:e.target.value})} placeholder="Headline" />
        <textarea value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} placeholder="Bio" />
        <input value={form.skills} onChange={e=>setForm({...form, skills:e.target.value})} placeholder="Skills (comma separated)" />
        <input type="number" value={form.experienceYears} onChange={e=>setForm({...form, experienceYears:e.target.value})} placeholder="Experience (years)" />
        <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} placeholder="Location" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
