import React from 'react';
import api from '../api';

export default function MatchRequests({ requests = [], refresh }) {
  const respond = async (id, action) => {
    try {
      await api.post(`/matches/${id}/respond`, { action });
      refresh && refresh();
    } catch (err) {
      alert('Error responding');
    }
  };

  if (!requests.length) return <p>No requests</p>;
  return (
    <div style={{display:'grid', gap:12}}>
      {requests.map(r=>(
        <div key={r._id} style={{padding:12, borderRadius:8, background:'rgba(255,255,255,0.02)'}}>
          <p><strong>{r.menteeId?.name}</strong> — {r.subject}</p>
          <p style={{opacity:0.8}}>{r.message}</p>
          <p style={{fontSize:12, opacity:0.7}}>{new Date(r.createdAt).toLocaleString()}</p>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            {r.status === 'pending' && <>
              <button onClick={()=>respond(r._id,'accept')}>Accept</button>
              <button onClick={()=>respond(r._id,'decline')}>Decline</button>
            </>}
            <span>Status: {r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
