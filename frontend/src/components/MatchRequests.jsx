import React from 'react';
import { updateMatchStatus, deleteMatch } from '../api';

export default function MatchRequests({ requests = [], refresh }) {
  const handleUpdate = async (id, status) => {
    try {
      await updateMatchStatus(id, status);
      refresh && refresh();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Cancel this request?")) return;
    try {
      await deleteMatch(id);
      refresh && refresh();
    } catch (err) {
      alert('Error deleting request');
    }
  };

  if (!requests.length) return <div className="p-4 text-muted">No match requests found.</div>;

  return (
    <div className="flex flex-col gap-4">
      {requests.map(r => {
        // Determine if I am the mentor or mentee
        // The backend populates 'mentor' and 'mentee' objects.
        // We can infer context or just show both names.

        return (
          <div key={r._id} className="card flex flex-col gap-2" style={{ padding: 16 }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-main" style={{ fontWeight: 600, marginBottom: 4 }}>
                  {r.mentee?.name || "Unknown Mentee"} <span className="text-muted font-normal">wants to match with</span> {r.mentor?.name || "Unknown Mentor"}
                </p>
                <p className="text-sm text-secondary italic">"{r.note || "No note provided"}"</p>
              </div>
              <span className={`text-sm font-bold ${r.status === 'accepted' ? 'text-success' : r.status === 'rejected' ? 'text-error' : 'text-warning'}`} style={{ color: r.status === 'accepted' ? 'var(--success)' : r.status === 'rejected' ? 'var(--error)' : 'var(--warning)' }}>
                {r.status.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2 mt-2">
              {/* Actions depend on status and role. 
                  Ideally we check userId, but for now we show actions if status is pending. 
                  The backend will enforce permissions. */}

              {r.status === 'pending' && (
                <>
                  <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(r._id, 'accepted')}>Accept</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleUpdate(r._id, 'rejected')}>Reject</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id)}>Cancel</button>
                </>
              )}

              {r.status !== 'pending' && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(r._id)}>Delete</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
