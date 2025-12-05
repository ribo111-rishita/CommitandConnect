import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/signup", form);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard"); // Redirect to dashboard instead of profile
      } else {
        setError("Signup succeeded but no token returned");
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data);
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h2 className="mb-4 text-center">Create Account</h2>

        <form onSubmit={handleSignup}>
          <div>
            <label>Full Name</label>
            <input
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              placeholder="you@college.edu"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              placeholder="••••••••"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div>
            <label>I am a...</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="mentee">Student (Mentee)</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-error rounded text-sm" style={{ background: '#fee2e2', color: '#ef4444' }}>{error}</div>}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  );
}
