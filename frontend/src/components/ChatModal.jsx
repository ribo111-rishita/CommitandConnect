import React, { useState } from "react";
import api from "../api";

export default function ChatModal({ open, onClose, mentor }) {
  if (!open) return null;  // ← THE ONLY CHECK WE KEEP

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const mentorName = mentor?.name || "Mentor";
  const mentorId = mentor?._id || mentor?.id || "unknown";

  const send = async () => {
    if (!text.trim()) return;

    const userMessage = { role: "user", text };
    setMessages((m) => [...m, userMessage]);
    setText("");

    try {
      const res = await api.post("/chat", {
        mentorId,
        message: userMessage.text,
      });

      const reply = res.data.reply || "No reply.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Chat failed." }]);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#fff",
          borderRadius: 12,
          padding: 16,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <strong>{mentorName}</strong>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#f1f5f9",
            borderRadius: 8,
            padding: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#c7dfff" : "#e2e8f0",
                padding: "8px 12px",
                borderRadius: 8,
                maxWidth: "75%",
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={send}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
