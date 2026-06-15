import React from 'react';
import AuthLayout from './AuthLayout';
import './AdminLoginPage.css';

export default function AdminLoginPage({ navigate }) {
  return (
    <div className="page" id="page-admin-login">
      <AuthLayout>
        <div className="auth-back" onClick={() => navigate('home')}>← Back to Home</div>
        <div className="auth-logo">
          <div className="logo-icon">⚙️</div>
          <div className="auth-logo-text">
            <div className="brand">Vidyalaya</div>
            <div className="tagline">School Management System</div>
          </div>
        </div>
        <div className="role-badge-auth" style={{ background: '#fef2f2', color: '#b91c1c' }}>⚙️ Admin Panel</div>
        <h2 className="auth-title">Admin Login</h2>
        <p className="auth-subtitle">Central control panel for school management.</p>
        <div className="form-group">
          <label className="form-label">Admin Email</label>
          <input className="form-input" type="email" placeholder="admin@vidyalaya.edu.in" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Enter admin password" />
        </div>
        <button className="btn-auth" onClick={() => navigate('admin-dashboard')}>Access Admin Panel →</button>
        <div className="form-help">Admin access is restricted. Unauthorized login attempts are logged.</div>
      </AuthLayout>
    </div>
  );
}