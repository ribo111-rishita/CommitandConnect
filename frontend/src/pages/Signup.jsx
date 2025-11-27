import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "mentee" });
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", form);
      // server returns token on signup — save and go to login
      const token = res.data?.token ?? res.data?.accessToken ?? null;
      if (token) localStorage.setItem("token", token);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.message || "Signup failed";
      setError(msg);
    }
  };

  return (
    <div className="wrapper">
      <div className="card">
        <h2>Create an account</h2>
        <form onSubmit={handleSignup}>
          <input placeholder="Full name" required onChange={(e)=>setForm({...form,name:e.target.value})} />
          <input placeholder="Email" type="email" required onChange={(e)=>setForm({...form,email:e.target.value})} />
          <input placeholder="Password" type="password" required onChange={(e)=>setForm({...form,password:e.target.value})} />
          <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>
          <button type="submit">Signup</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p style={{textAlign:"center", marginTop:12}}>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}
