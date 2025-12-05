// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { getMentors, getMatches, deleteProfile } from '../api';
import MentorList from '../components/MentorList';
import MatchRequests from '../components/MatchRequests';
import MentorFilters from '../components/MentorFilters';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({});
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const fetchProfiles = (filtersArg = {}, page = 1) => {
    setLoading(true);
    const params = { ...filtersArg, page, limit: 12 };
    getMentors(params)
      .then(res => {
        setProfiles(res.data.data || []);
        setMeta(res.data.meta || { page, limit: 12, total: res.data.data?.length || 0, pages: 1 });
      })
      .catch(() => {
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchRequests = () => {
    getMatches()
      .then(res => setRequests(res.data || []))
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    fetchProfiles(filters, 1);
    fetchRequests();
  }, []); // initial load

  useEffect(() => {
    fetchProfiles(filters, 1);
  }, [filters]);

  const handlePage = (nextPage) => {
    fetchProfiles(filters, nextPage);
  };

  const handleDeleteOwnProfile = async () => {
    if (!confirm('Are you sure you want to delete your mentor profile? This cannot be undone.')) return;
    try {
      await deleteProfile();
      alert('Profile deleted');
      fetchProfiles(filters, meta.page); // Refresh list
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="container">
      {/* HERO */}
      <section className="card mb-4" style={{ background: '#000000', color: '#ffffff' }}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 style={{ color: '#ffffff' }}>Commit & Connect</h1>
              <p style={{ maxWidth: 600, color: '#cccccc' }}>
                Find the right mentor for your college journey. Connect with experienced students for guidance on subjects, projects, and careers.
              </p>
            </div>
            <div>
              <button className="btn btn-primary" onClick={() => nav('/edit-profile')}>My Profile</button>
            </div>
          </div>

          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-700">
            <div><strong>1200+</strong> <span style={{ color: '#9ca3af' }}>students</span></div>
            <div><strong>350+</strong> <span style={{ color: '#9ca3af' }}>mentors</span></div>
            <div><strong>6h</strong> <span style={{ color: '#9ca3af' }}>avg response</span></div>
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-6" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>

        {/* LEFT SIDEBAR */}
        <aside className="flex flex-col gap-4">
          <div className="card">
            <h3>Find Mentors</h3>
            <p className="text-sm">Filter by expertise or availability.</p>
            <MentorFilters onChange={setFilters} />

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="btn btn-ghost btn-sm text-error w-full" onClick={handleDeleteOwnProfile}>
                Delete My Profile
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex flex-col gap-6">

          {/* MENTOR LIST */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2>Recommended Mentors</h2>
              <div className="text-sm text-muted">Page {meta.page} of {meta.pages}</div>
            </div>

            {loading ? (
              <div className="text-center p-8 text-muted">Loading mentors...</div>
            ) : profiles.length === 0 ? (
              <div className="text-center p-8 text-muted">No mentors found. Try adjusting filters.</div>
            ) : (
              <MentorList profiles={profiles} />
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button
                className="btn btn-secondary btn-sm"
                disabled={meta.page <= 1}
                onClick={() => handlePage(meta.page - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={meta.page >= meta.pages}
                onClick={() => handlePage(meta.page + 1)}
              >
                Next
              </button>
            </div>
          </div>

          {/* MATCH REQUESTS */}
          <div className="card">
            <h3>Match Requests</h3>
            <p className="text-sm mb-4">Requests you have sent or received.</p>
            <MatchRequests requests={requests} refresh={fetchRequests} />
          </div>

        </main>
      </div>
    </div>
  );
}
