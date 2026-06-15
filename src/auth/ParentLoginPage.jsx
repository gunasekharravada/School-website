import React from 'react';
import AuthLayout from './AuthLayout';
import './ParentLoginPage.css';
export default function ParentLoginPage({ navigate }) {
  return (
    <div className="page" id="page-parent-login">
      <AuthLayout>
        <div className="auth-back" onClick={() => navigate('home')}>← Back to Home</div>
        <div className="auth-logo">
          <div className="logo-icon">👨‍👩‍👧</div>
          <div className="auth-logo-text">
            <div className="brand">Vidyalaya</div>
            <div className="tagline">School Management System</div>
          </div>
        </div>
        <div className="role-badge-auth" style={{ background: '#fef3c7', color: '#b45309' }}>👨‍👩‍👧 Parent Portal</div>
        <h2 className="auth-title">Parent Login</h2>
        <p className="auth-subtitle">Track your child's attendance, results, and school updates.</p>
        <div className="form-group">
          <label className="form-label">Parent Email</label>
          <input className="form-input" type="email" placeholder="parent@email.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Enter your password" />
        </div>
        <button className="btn-auth" onClick={() => navigate('parent-dashboard')}>Login to Parent Portal →</button>
        <div className="form-help">Don't have an account? Your credentials were sent to your registered email during admission.</div>
      </AuthLayout>
    </div>
  );
}