import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/users/me")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.error('Failed /users/me', err);
        localStorage.removeItem("token");
        nav("/login");
      });
  }, [nav]);

  if (!user) return <div className="card"><h2>Loading...</h2></div>;

  return (
    <div className="profile-layout">


      <div className="welcome-section">
        <h1 className="welcome-title">Welcome, {user.name}</h1>
        <p className="welcome-sub">Role: {user.role}</p>

      </div>


      <div className="dashboard-main">
        <h2>Main Dashboard</h2>
        <p>Here you can show stats, progress, features, etc.</p>
      </div>


      <div className="mentor-section">
        <h2>Selected Mentors</h2>

        <div className="mentor-grid">
          {["John Doe", "Aarav Sharma", "Sophia Verma", "Neha Patel", "Rohan Singh"].map((mentor, idx) => (
            <div key={idx} className="mentor-card">
              <h3>{mentor}</h3>
              <p>Expert in: Web Dev / Design / AI</p>
              <button className="choose-btn">Connect</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
 