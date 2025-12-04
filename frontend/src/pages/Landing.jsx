// src/pages/Landing.jsx
import React, { useEffect, useState } from "react";
import api from "../api"; // axios instance; should be set to baseURL http://localhost:8000 or similar
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMentor, setChatMentor] = useState(null);

  // add-mentor demo state
  const [showAdd, setShowAdd] = useState(false);
  const [newMentor, setNewMentor] = useState({ name: "", expertise: "", bio: "" });
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchProfiles = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/mentors/profiles", { params: { page, limit: 12 }});
      setProfiles(res.data.data || []);
      setMeta(res.data.meta || { page: 1, pages: 1 });
    } catch (err) {
      console.error("fetchProfiles err", err);
      setProfiles([]);
    } finally { setLoading(false); }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get("/matches/mentor");
      setRequests(res.data || []);
    } catch (err) {
      console.error("fetchRequests", err);
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchProfiles(1);
    fetchRequests();
  }, []);

  // Connect -> create match
  const handleConnect = async (mentor) => {
    try {
      await api.post("/matches", { mentorId: mentor._id || mentor.id, note: "Hi! I'd like to connect." });
      alert("Request sent to " + mentor.name);
      fetchRequests();
    } catch (err) {
      console.error("connect err", err);
      alert("Failed to send request");
    }
  };

  const openChat = (mentor) => {
    setChatMentor(mentor);
    setChatOpen(true);
  };

  // Add mentor form (demo/admin)
  const handleCreateMentor = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", newMentor.name);
      fd.append("expertise", newMentor.expertise);
      fd.append("bio", newMentor.bio);
      if (avatarFile) fd.append("avatar", avatarFile);
      // auth required — if running locally for dev, ensure token or temporarily unprotected route
      const res = await api.post("/mentors/profile", fd, { headers: { "Content-Type": "multipart/form-data" }});
      alert("Created mentor: " + (res.data.name || "ok"));
      setNewMentor({ name: "", expertise: "", bio: "" });
      setAvatarFile(null);
      setShowAdd(false);
      fetchProfiles(1);
    } catch (err) {
      console.error("create mentor err", err);
      alert("Create failed");
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: "Inter, system-ui, Arial", background: "#0b0b0b", color: "#fff", minHeight: "100vh" }}>
      <style>{`
        .container { max-width:1200px; margin:0 auto; }
        .hero { display:flex; justify-content:space-between; gap:16px; align-items:center; margin-bottom:28px; }
        .brand { font-weight:800; color:#b7ff31; font-size:20px; }
        .card { background:#0f1720; border-radius:12px; padding:18px; box-shadow: 0 6px 20px rgba(0,0,0,0.5); }
        .mentor-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; margin-top:18px; }
        .mentor-card { background:#fff; color:#0b1220; border-radius:12px; padding:14px; display:flex; flex-direction:column; min-height:240px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .avatar { width:72px; height:72px; border-radius:10px; overflow:hidden; display:flex; align-items:center; justify-content:center; font-weight:700; background:#eef2ff; }
        .btn { padding:10px 12px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
        .btn-primary { background:#2563eb; color:#fff; }
        .btn-ghost { background:transparent; color:#0b1220; border:1px solid rgba(11,18,32,0.06); }
        .page-btn { padding:8px 10px; border-radius:8px; background:#fff; border:1px solid rgba(11,18,32,0.06); cursor:pointer; }
        .muted { color:#94a3b8; font-size:13px; }
        @media (max-width:880px){ .hero { flex-direction:column; align-items:flex-start } .mentor-grid{ grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); } }
      `}</style>

      <div className="container">
        <div className="hero">
          <div>
            <div className="brand">Commit&Connect</div>
            <h1 style={{ margin: "8px 0 6px 0" }}>Welcome, { /* possibly get user name from /users/me - quick fetch omitted here */ "student" }</h1>
            <div className="muted">Find mentors, request matches and chat with AI-powered mentor assistants</div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary" onClick={() => nav("/signup")}>Get Started</button>
            <button className="btn" onClick={() => setShowAdd(s => !s)} style={{ background: "#111827", color: "#fff", border: "1px solid #2d3748" }}>{showAdd ? "Close" : "Add Mentor (demo)"}</button>
          </div>
        </div>

        {showAdd && (
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Create demo mentor (admin)</h3>
            <form onSubmit={handleCreateMentor} style={{ display: "grid", gap: 8 }}>
              <input placeholder="Name" required value={newMentor.name} onChange={e=>setNewMentor({...newMentor, name: e.target.value})} />
              <input placeholder="Expertise" required value={newMentor.expertise} onChange={e=>setNewMentor({...newMentor, expertise: e.target.value})} />
              <textarea placeholder="Bio" value={newMentor.bio} onChange={e=>setNewMentor({...newMentor, bio: e.target.value})} />
              <input type="file" accept="image/*" onChange={e=>setAvatarFile(e.target.files[0])} />
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" type="submit">Create</button>
                <button type="button" className="btn" onClick={()=>{ setShowAdd(false); setNewMentor({name:"",expertise:"",bio:""}); setAvatarFile(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="card" style={{ marginBottom: 18 }}>
          <h2 style={{ margin: 0 }}>Main Dashboard</h2>
          <p className="muted" style={{ marginTop: 8 }}>Quick stats & actions</p>
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            <div style={{ background:"#071023", padding:12, borderRadius:8 }}>
              <div style={{ fontWeight:700 }}>Matches</div>
              <div className="muted">{requests.length}</div>
            </div>
            <div style={{ background:"#071023", padding:12, borderRadius:8 }}>
              <div style={{ fontWeight:700 }}>Mentors</div>
              <div className="muted">{meta.total || profiles.length}</div>
            </div>
            <div style={{ background:"#071023", padding:12, borderRadius:8 }}>
              <div style={{ fontWeight:700 }}>Active Chats</div>
              <div className="muted">AI Chat enabled</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <h3 style={{ margin: "12px 0" }}>Select Mentors</h3>
          <div className="mentor-grid">
            {loading ? <div className="muted">Loading mentors...</div> : (profiles.length === 0 ? <div className="muted">No mentors yet</div> : profiles.map(m => (
              <div className="mentor-card" key={m._id || m.id || m.name}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="avatar">
                    {m.avatarUrl ? (
                      <img src={m.avatarUrl} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ fontSize: 20 }}>{(m.name || "??").split(" ").map(n => n[0]).slice(0,2).join("")}</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>{m.name}</div>
                    <div className="muted" style={{ marginTop: 6 }}>{m.expertise}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, flex: 1, color: "#475569" }}>{m.bio || "No bio provided."}</div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="btn page-btn" onClick={() => nav(`/mentors/${m._id || m.id}`)}>View</button>
                  <button className="btn btn-primary" onClick={() => handleConnect(m)}>Connect</button>
                  <button className="btn" onClick={() => openChat(m)}>Chat</button>
                </div>
              </div>
            )))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
            <button className="page-btn" disabled={meta.page <= 1} onClick={() => { fetchProfiles(Math.max(1, meta.page - 1)); }}>Prev</button>
            <div style={{ padding: "8px 12px" }}>{meta.page} / {meta.pages}</div>
            <button className="page-btn" disabled={meta.page >= meta.pages} onClick={() => { fetchProfiles(Math.min(meta.pages, (meta.page || 1) + 1)); }}>Next</button>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 6 }}>Match Requests</h3>
          <div className="card">
            {requests.length === 0 ? <div className="muted" style={{ padding: 12 }}>No requests yet</div> : requests.map(r => (
              <div key={r._id || r.id} style={{ display: "flex", justifyContent: "space-between", padding: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.mentorName || r.mentor?.name || "mentor"}</div>
                  <div className="muted">{r.note}</div>
                </div>
                <div className="muted">{new Date(r.createdAt || r.created).toLocaleString?.() || ""}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {chatOpen && chatMentor && (
        <ChatModal mentor={chatMentor} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}

/* -------------------------
   Chat modal component (inline)
   ------------------------- */
function ChatModal({ mentor, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  // Keep messages if you want; reset when closed is optional

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setText("");
    try {
      const res = await api.post("/chat", { mentorId: mentor._id || mentor.id, message: userMsg.text });
      const reply = res.data.reply || "No reply";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("chat send err", err);
      setMessages(prev => [...prev, { role: "assistant", text: "Chat failed — try again." }]);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(2,6,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000
    }}>
      <div style={{ width: "min(920px,96%)", maxHeight: "90vh", background: "#fff", color: "#0b1220", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 800 }}>{mentor.name}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{mentor.expertise} • AI chat</div>
          </div>
          <div>
            <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: 18 }}>✕</button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eef2f7", marginTop: 12, paddingTop: 12, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <div style={{ overflow: "auto", maxHeight: "56vh", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.length === 0 && <div style={{ color: "#94a3b8" }}>Say hi — assistant replies as the mentor persona.</div>}
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                padding: "8px 12px", borderRadius: 10, maxWidth: "80%",
                background: m.role === "user" ? "#e6f0ff" : "#f3f4f6"
              }}>{m.text}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Ask a question..." style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e6eef8" }} />
            <button onClick={send} className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
