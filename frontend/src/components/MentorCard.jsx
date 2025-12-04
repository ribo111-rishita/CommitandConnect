import React, { useState } from "react";
import ChatModal from "./ChatModal";

export default function MentorCard({ mentor }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{
          padding: 16,
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          width: "250px",
        }}
      >
        <img
          src={mentor.photoUrl || "https://placehold.co/300x200"}
          style={{ width: "100%", borderRadius: 10 }}
          alt=""
        />

        <h3 style={{ margin: 0 }}>{mentor.name}</h3>
        <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
          {mentor.expertise || "General mentor"}
        </p>

        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: 10,
          }}
        >
          Chat
        </button>
      </div>

      <ChatModal open={open} onClose={() => setOpen(false)} mentor={mentor} />
    </>
  );
}
