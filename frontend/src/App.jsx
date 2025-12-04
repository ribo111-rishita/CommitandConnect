// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OAuthCallback from "./pages/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import MentorProfile from "./pages/MentorProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="wrapper">
        <Routes>

          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor/:id"
            element={
              <ProtectedRoute>
                <MentorProfile />
              </ProtectedRoute>
            }
          />

          {/* ❌ REMOVED CHAT ROUTE (popup chat only, no page) */}
          {/* <Route path="/chat/:userId" ... /> */}

        </Routes>
      </div>
    </BrowserRouter>
  );
}
