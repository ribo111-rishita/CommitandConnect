import React, { useState } from "react";
import { createMatch } from "../api";

export default function MentorCard({ mentor }) {
  const [showRequest, setShowRequest] = useState(false);
  const [note, setNote] = useState("");

  const handleRequest = async () => {
    try {
      await createMatch({ mentorId: mentor._id, note });
      alert("Request sent!");
      setShowRequest(false);
      setNote("");
    } catch (err) {
      alert("Failed to send request: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="card flex flex-col gap-2">
      <div style={{ height: 180, overflow: 'hidden', borderRadius: 'var(--radius-sm)', background: '#eee' }}>
        <img
          src={mentor.avatarUrl || "https://placehold.co/400x300?text=No+Avatar"}
          alt={mentor.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="mt-4">
        <h3>{mentor.name}</h3>
        <p className="text-sm text-primary font-bold" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          {mentor.expertise || "Mentor"}
        </p>
        <p className="text-sm text-secondary line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {mentor.bio || "No bio available."}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted">{mentor.availability || "Flexible"}</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowRequest(!showRequest)}
        >
          {showRequest ? "Cancel" : "Connect"}
        </button>
      </div>

      {showRequest && (
        <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100" style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
          <textarea
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mb-2"
          />
          <button className="btn btn-primary btn-sm w-full" onClick={handleRequest}>
            Send Request
          </button>
        </div>
      )}
    </div>
  );
}
