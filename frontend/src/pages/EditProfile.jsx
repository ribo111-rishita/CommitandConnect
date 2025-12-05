// src/pages/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import { getMyProfile, createProfile, updateProfile } from '../api';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  const [form, setForm] = useState({
    name: '',
    expertise: '',
    bio: '',
    persona: '',
    availability: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    getMyProfile()
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name || '',
          expertise: p.expertise || '',
          bio: p.bio || '',
          persona: p.persona || '',
          availability: p.availability || '',
        });
        setIsNew(false);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setIsNew(true); // Profile doesn't exist, so we are creating
        } else {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('expertise', form.expertise);
    formData.append('bio', form.bio);
    formData.append('persona', form.persona);
    formData.append('availability', form.availability);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      if (isNew) {
        await createProfile(formData);
      } else {
        await updateProfile(formData);
      }
      alert('Profile saved!');
      nav('/dashboard');
    } catch (err) {
      console.error('Save failed', err);
      alert('Save failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="card" style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h2>{isNew ? 'Create' : 'Edit'} Mentor Profile</h2>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Name</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name"
            required
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Expertise</label>
          <input
            value={form.expertise}
            onChange={e => setForm({ ...form, expertise: e.target.value })}
            placeholder="e.g. React, Python, Career Advice"
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={4}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Persona / Role</label>
          <input
            value={form.persona}
            onChange={e => setForm({ ...form, persona: e.target.value })}
            placeholder="e.g. Friendly Mentor, Strict Coach"
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Availability</label>
          <input
            value={form.availability}
            onChange={e => setForm({ ...form, availability: e.target.value })}
            placeholder="e.g. Weekends, Mon-Fri evenings"
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setAvatarFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#1847ff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 10
          }}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
