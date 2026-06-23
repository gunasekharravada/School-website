import React, { useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AuthLayout from './AuthLayout';
import './TeacherLoginPage.css';

export default function TeacherLoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [dobPassword, setDobPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    loading || setLoading(true);

    if (!email || !dobPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // Query the database directly matching contactInfo.email and dateOfBirth in YYYY-MM-DD format
      const teachersRef = collection(db, 'teachers');
      const q = query(
        teachersRef, 
        where('contactInfo.email', '==', email.trim()), 
        where('dateOfBirth', '==', dobPassword.trim())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let teacherData = null;
        querySnapshot.forEach((doc) => {
          teacherData = { id: doc.id, ...doc.data() };
        });

        // Clear any stale previous session before writing a new one
        localStorage.removeItem('teacherSession');
        sessionStorage.removeItem('teacherSession');

        localStorage.setItem('teacherSession', JSON.stringify(teacherData));
        navigate('teacher-dashboard');
      } else {
        setError('Invalid Email or Date of Birth.');
      }
    } catch (err) {
      console.error("Login Error: ", err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div 
            className="error-message-alert" 
            style={{ 
              color: '#b91c1c', 
              background: '#fef2f2', 
              padding: '10px', 
              borderRadius: '6px', 
              marginBottom: '15px', 
              fontSize: '14px', 
              textAlign: 'center', 
              border: '1px solid #fca5a5' 
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              className="form-input" 
              type="email"
              placeholder="e.g., teacher@vidyalaya.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Date of Birth)</label>
            <div className="password-input-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                className="form-input" 
                type={showPassword ? "text" : "password"} 
                placeholder="YYYY-MM-DD" 
                value={dobPassword}
                onChange={(e) => setDobPassword(e.target.value)}
                disabled={loading}
                style={{ width: '100%', paddingRight: '40px' }} 
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0' }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px', color: '#6b7280' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px', color: '#6b7280' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-auth" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '15px' }}
          >
            {loading ? 'Verifying...' : 'Login to Teacher Portal →'}
          </button>
        </form>

        <div className="form-help">Need help? Contact the <a style={{ color: 'var(--secondary)', cursor: 'pointer' }}>IT support team</a>.</div>
      </AuthLayout>
    </div>
  );
}