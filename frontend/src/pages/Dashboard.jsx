// src/pages/Landing.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import MentorList from '../components/MentorList';
import MatchRequests from '../components/MatchRequests';
import MentorFilters from '../components/MentorFilters';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [profiles, setProfiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({});
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const fetchProfiles = (filtersArg = {}, page = 1) => {
    setLoading(true);
    const params = { ...filtersArg, page, limit: 12 };
    api.get('/mentors/profiles', { params })
      .then(res => {
        setProfiles(res.data.data || []);
        setMeta(res.data.meta || { page, limit: 12, total: res.data.data?.length || 0, pages: 1 });
      })
      .catch(() => {
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfiles(filters, 1);
    api.get('/matches/mentor')
      .then(res => setRequests(res.data || []))
      .catch(() => setRequests([]));
  }, []); // initial load

  useEffect(() => {
    fetchProfiles(filters, 1);
  }, [filters]);

  const handlePage = (nextPage) => {
    fetchProfiles(filters, nextPage);
  };

  const handleDeleteProfile = async (profileId) => {
    if (!confirm('Delete this profile?')) return;
    try {
      await api.delete(`/mentors/profile/${profileId}`);
      fetchProfiles(filters, meta.page);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="landing-root">
      <style>{`
        /* Base + layout */
        .landing-root { font-family: Inter, Roboto, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial; color: #0b1220; padding: 40px 28px; box-sizing: border-box; background: #f7f9fb; min-height: 100vh; }

        .container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 28px; }

        /* HERO */
        .hero { display: flex; flex-direction: column; gap: 18px; background: linear-gradient(180deg, #ffffffcc, #ffffffcc); border-radius: 12px; padding: 28px; box-shadow: 0 8px 30px rgba(17,24,39,0.06); }
        .hero-top { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
        .brand { display:flex; align-items:center; gap:14px; }
        .brand-logo { width:48px; height:48px; border-radius:10px; background: linear-gradient(135deg, #6b8cff, #7de0b5); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:18px; box-shadow: 0 6px 18px rgba(106, 115, 255, 0.18); }
        .headline { font-size:28px; font-weight:700; margin:0; color:#071023; }
        .subtitle { margin:0; color:#475569; font-size:15px; max-width:720px; line-height:1.45; }

        .hero-cta { display:flex; gap:12px; align-items:center; }
        .btn-primary { padding:10px 16px; border-radius:10px; background:#1847ff; color:white; border:none; cursor:pointer; font-weight:600; box-shadow: 0 8px 18px rgba(24,71,255,0.12); }
        .btn-ghost { padding:10px 16px; border-radius:10px; background:transparent; border:1px solid rgba(7,16,35,0.06); cursor:pointer; color:#0b1220; font-weight:600; }

        /* HERO STATS */
        .stats { display:flex; gap:16px; margin-top:8px; flex-wrap:wrap; }
        .stat { background:rgba(24,71,255,0.04); padding:10px 14px; border-radius:10px; font-weight:600; color:#0b1220; font-size:14px; }

        /* CONTENT SECTIONS */
        .split { display:grid; grid-template-columns: 360px 1fr; gap:20px; align-items:start; }
        .card { background:white; border-radius:12px; padding:18px; box-shadow: 0 6px 18px rgba(9, 30, 66, 0.04); }

        .filters-area { position: sticky; top: 24px; }
        .list-area h2 { margin:0 0 12px 0; font-size:18px; }

        /* MENTOR GRID (MentorList should render cards inside .mentor-grid) */
        .mentor-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:16px; margin-top:12px; }

        /* PAGINATION */
        .pagination { display:flex; gap:8px; justify-content:center; margin-top:18px; align-items:center; }
        .page-btn { padding:8px 12px; border-radius:8px; border:1px solid rgba(9,30,66,0.08); background:white; cursor:pointer; min-width:80px; }

        /* REQUESTS / HELP */
        .requests-list { display:flex; flex-direction:column; gap:10px; margin-top:8px; }

        /* FOOTER */
        .landing-footer { text-align:center; color:#667085; font-size:14px; padding:20px 0; margin-top:10px; }

        /* responsive */
        @media (max-width: 880px) {
          .split { grid-template-columns: 1fr; }
          .brand-logo { width:42px; height:42px; }
          .headline { font-size:22px; }
          .container { padding: 0 12px; }
        }
      `}</style>

      <div className="container">
        {/* HERO */}
        <section className="hero">
          <div className="hero-top">
            <div className="brand">
              <div className="brand-logo">C&C</div>
              <div>
                <h1 className="headline">Commit&Connect — find the right mentor for your college journey</h1>
                <p className="subtitle">Connect with experienced student mentors across subjects, projects and career guidance. Fast matching, reliable profiles, and friendly mentors from your campus network.</p>
              </div>
            </div>

         
          </div>

          <div className="stats" aria-hidden>
            <div className="stat">1200+ students helped</div>
            <div className="stat">350+ mentors</div>
            <div className="stat">Avg. response: 6 hrs</div>
          </div>
        </section>

        {/* MAIN CONTENT SPLIT: filters (left) / mentors (right) */}
        <section className="split">
          {/* LEFT - Filters / How it works */}
          <aside className="filters-area card">
            <h3 style={{ margin: 0, fontSize: 16 }}>Find mentors</h3>
            <p style={{ marginTop: 8, marginBottom: 12, color: '#6b7280', fontSize: 13 }}>Filter by expertise, year, or availability to quickly surface mentors matching your needs.</p>

            <div style={{ marginBottom: 12 }}>
              {/* Reuse your MentorFilters component */}
              <MentorFilters onChange={setFilters} />
            </div>

            <div style={{ borderTop: '1px solid #eef2f7', marginTop: 12, paddingTop: 12 }}>
              <h4 style={{ margin: 0, fontSize: 14 }}>How it works</h4>
              <ol style={{ marginTop: 8, paddingLeft: 18, color: '#475569', fontSize: 14 }}>
                <li>Search mentors by skill or subject.</li>
                <li>Send a match request with a short note.</li>
                <li>Meet and grow — schedule sessions directly.</li>
              </ol>
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => nav('/mentors')}>Explore all mentors</button>
            </div>
          </aside>

          {/* RIGHT - Mentor list + pagination */}
          <main className="list-area">
            <div className="card" style={{ marginBottom: 14 }}>
              <h2 style={{ margin: 0 }}>Recommended mentors</h2>
              <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: 13 }}>
                Curated mentors based on your filters. Click a card to view profile or request a match.
              </p>

              {/* Mentors container — MentorList should either accept a container or render its own cards.
                  We provide a wrapper (.mentor-grid) — if MentorList already renders a grid, it's fine. */}
              <div className="mentor-grid">
                {loading ? (
                  <div style={{ padding: 24, color: '#94a3b8' }}>Loading mentors…</div>
                ) : profiles.length === 0 ? (
                  <div style={{ padding: 24, color: '#94a3b8' }}>No mentors found. Try different filters.</div>
                ) : (
                  /* If MentorList expects props and renders grid, we pass it directly.
                     If MentorList renders its own container, it will work as well. */
                  <MentorList profiles={profiles} onDelete={handleDeleteProfile} />
                )}
              </div>

              <div className="pagination">
                <button className="page-btn" disabled={meta.page <= 1} onClick={() => handlePage(meta.page - 1)}>Prev</button>
                <div style={{ padding: '8px 12px', color: '#475569' }}>{meta.page} {meta.pages}</div>
                <button className="page-btn" disabled={meta.page >= meta.pages} onClick={() => handlePage(meta.page + 1)}>Next</button>
              </div>
            </div>

            {/* Requests / quick actions */}
            <div className="card">
              <h3 style={{ margin: 0 }}>Match requests</h3>
              <p style={{ marginTop: 8, marginBottom: 12, color: '#64748b', fontSize: 13 }}>Requests you've sent or received (requires login).</p>
              <div className="requests-list">
                <MatchRequests requests={requests} refresh={() => { api.get('/matches/mentor').then(r => setRequests(r.data || [])) }} />
              </div>
            </div>
          </main>
        </section>

        <div className="landing-footer">
          © {new Date().getFullYear()} Commit & Connect — built for students. • <button className="btn-ghost" style={{ display: 'inline-block', padding: '6px 10px', borderRadius: 8 }} onClick={() => nav('/about')}>About</button>
        </div>
      </div>
    </div>
  );
}
