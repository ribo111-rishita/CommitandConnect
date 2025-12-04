import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import OAuthButtons from "../components/OAuthButtons";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      console.log("LOGIN RESPONSE data:", res.data);
      const token = res.data?.token || null;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/profile");
        return;
      }
      setError("Login succeeded but token missing; check server response");
    } catch (err) {
      console.error("Login error", err.response?.data || err.message);
      setError(err.response?.data?.msg || "Server error");
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}
        <p className="small-link"><a href="/signup">Sign up</a></p>

        <div style={{ marginTop: 18 }}>
          <OAuthButtons demo={false} />
        </div>
      </div>
    </div>
  );
}