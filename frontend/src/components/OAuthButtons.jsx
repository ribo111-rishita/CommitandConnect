import React from "react";

export default function OAuthButtons() {
  return (
    <div className="oauth-wrap">

      {/* GOOGLE */}
      <a
        className="oauth-btn oauth-btn--google"
        href="http://localhost:8000/api/auth/oauth/google"
      >
        <span className="oauth-icon">G</span>
        <span>Continue with Google</span>
      </a>

      {/* APPLE */}
      <a
        className="oauth-btn oauth-btn--apple"
        href="http://localhost:8000/api/auth/oauth/apple"
      >
        <span className="oauth-icon"></span>
        <span>Continue with Apple</span>
      </a>

      {/* FACEBOOK */}
      <a
        className="oauth-btn oauth-btn--facebook"
        href="http://localhost:8000/api/auth/oauth/facebook"
      >
        <span className="oauth-icon">f</span>
        <span>Continue with Facebook</span>
      </a>

    </div>
  );
}