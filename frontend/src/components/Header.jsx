// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">

        {/* LEFT SIDE */}
        <div className="header-left">
          <Link to={token ? "/dashboard" : "/"} className="logo">Commit&amp;Connect</Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="header-right">
          {!token ? (
            <>
              <Link to="/signup" className="nav-btn nav-btn--outline">Signup</Link>
              <Link to="/login" className="nav-btn nav-btn--outline">Login</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="nav-btn nav-btn--outline" style={{cursor:'pointer'}}>Logout</button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
