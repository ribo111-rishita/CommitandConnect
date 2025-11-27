import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/users/me")
      .then(res => {
        console.log('/users/me response', res.data);
        const payload = res.data?.user ?? res.data;
        setUser(payload);
      })
      .catch(err => {
        console.error('Failed /users/me', err);
        localStorage.removeItem("token");
        nav("/login");
      });
  }, []);

  if (!user) return <div className="wrapper"><div className="card"><p>Loading...</p></div></div>;

  return (
    <div className="wrapper">
      <div className="card">
        <h2>Hello, {user.name ?? "—"}</h2>
        <p><strong>Email:</strong> {user.email ?? "—"}</p>
        <p><strong>Role:</strong> {user.role ?? "—"}</p>
        <button onClick={() => { localStorage.removeItem("token"); nav("/login"); }}>
          Logout
        </button>
      </div>
    </div>
  );
}

