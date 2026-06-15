import React from 'react';
import AuthLayout from './AuthLayout';
import './StudentLoginPage.css';
export default function StudentLoginPage({ navigate }) {
  return (
    <div className="page" id="page-student-login">
      <AuthLayout>
        <div className="auth-back" onClick={() => navigate('home')}>← Back to Home</div>
        <div className="auth-logo">
          <div className="logo-icon">🎓</div>
          <div className="auth-logo-text">
            <div className="brand">Vidyalaya</div>
            <div className="tagline">School Management System</div>
          </div>
        </div>
        <div className="role-badge-auth" style={{ background: '#eff6ff', color: '#1d4ed8' }}>🎓 Student Portal</div>
        <h2 className="auth-title">Student Login</h2>
        <p className="auth-subtitle">Access your dashboard, materials, and quizzes.</p>
        <div className="form-group">
          <label className="form-label">Roll Number</label>
          <input className="form-input" placeholder="e.g., VID2024001" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Enter your password" />
        </div>
        <button className="btn-auth" onClick={() => navigate('student-dashboard')}>Login to Student Portal →</button>
        <div className="form-help">Forgot password? Contact your class teacher or <a style={{ color: 'var(--secondary)', cursor: 'pointer' }}>reset via email</a>.</div>
      </AuthLayout>
    </div>
  );
}