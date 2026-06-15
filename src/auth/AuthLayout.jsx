import React from 'react';
import './AuthLayout.css'; // Imports the core structure & responsive rules

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-container">
        {children}
      </div>
    </div>
  );
}