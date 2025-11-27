import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      console.log("LOGIN RESPONSE data:", res.data);
      const token =
        res.data?.token ||
        res.data?.accessToken ||
        res.data?.data?.token ||
        (typeof res.data === "string" ? res.data : null);

      if (token) {
        localStorage.setItem("token", token);
        navigate("/profile");
        return;
      }

      // If backend returns { user: {...} } without token, show message
      setError("Login succeeded but token missing; check server response (see console).");
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.message || "Invalid email or password";
      setError(msg);
      console.error("Login request failed:", err);
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input placeholder="Email" type="email" required onChange={(e)=>setForm({...form,email:e.target.value})} />
          <input placeholder="Password" type="password" required onChange={(e)=>setForm({...form,password:e.target.value})} />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p style={{textAlign:"center", marginTop:12}}>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}
