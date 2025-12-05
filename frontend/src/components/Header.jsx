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
    <header className="site-header">
      <div className="header-inner">
        <div className="flex-1">
          <Link to={token ? "/dashboard" : "/"} className="logo">
            Commit&Connect
          </Link>
        </div>

        <nav className="flex gap-4 items-center">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/edit-profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
