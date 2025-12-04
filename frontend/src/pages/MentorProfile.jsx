// src/pages/MentorProfile.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';

export default function MentorProfile() {
  const { id } = useParams(); // userId
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  useEffect(()=> {
    // fixed endpoint: GET /api/mentors/profile/:id
    api.get(`/mentors/profile/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!profile) return <div className="card"><h3>Loading...</h3></div>;

  const handleRequest = async () => {
    try {
      await api.post('/matches', { mentorId: id, subject, message });
      alert('Request sent');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="card">
      <h2>{profile.userId?.name}</h2>
      <p>{profile.bio}</p>
      <p><strong>Skills: </strong>{profile.skills?.join(', ')}</p>

      <div style={{marginTop:12}}>
        <input placeholder="Subject" value={subject} onChange={e=>setSubject(e.target.value)} />
        <textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} />
        <button onClick={handleRequest}>Send match request</button>
      </div>
    </div>
  );
}
