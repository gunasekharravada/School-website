import React from 'react';
import AuthLayout from './AuthLayout';
import './TeacherLoginPage.css';

export default function TeacherLoginPage({ navigate }) {
  return (
    <div className="page" id="page-teacher-login">
      <AuthLayout>
        <div className="auth-back" onClick={() => navigate('home')}>← Back to Home</div>
        <div className="auth-logo">
          <div className="logo-icon">👩‍🏫</div>
          <div className="auth-logo-text">
            <div className="brand">Vidyalaya</div>
            <div className="tagline">School Management System</div>
          </div>
        </div>
        <div className="role-badge-auth" style={{ background: '#f0fdf4', color: '#15803d' }}>👩‍🏫 Teacher Portal</div>
        <h2 className="auth-title">Teacher Login</h2>
        <p className="auth-subtitle">Manage your classes, upload materials, and track students.</p>
        <div className="form-group">
          <label className="form-label">Employee ID</label>
          <input className="form-input" placeholder="e.g., TCH20240001" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Enter your password" />
        </div>
        <button className="btn-auth" onClick={() => navigate('teacher-dashboard')}>Login to Teacher Portal →</button>
        <div className="form-help">Need help? Contact the <a style={{ color: 'var(--secondary)', cursor: 'pointer' }}>IT support team</a>.</div>
      </AuthLayout>
    </div>
  );
}