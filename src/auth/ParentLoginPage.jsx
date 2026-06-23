import React, { useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import AuthLayout from './AuthLayout';
import './ParentLoginPage.css';

export default function ParentLoginPage({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // This will hold the DD-MM-YYYY input
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  // Helper function to convert DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD
  const convertToDbDateFormat = (dateString) => {
    // Replaces slashes or dots with hyphens just in case
    const cleanDate = dateString.replace(/[\/.]/g, '-').trim();
    const parts = cleanDate.split('-');
    
    // Ensure we have 3 parts (day, month, year)
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      
      // Returns YYYY-MM-DD to match your Firestore Option A structure
      return `${year}-${month}-${day}`;
    }
    return dateString; // Fallback if format is unexpected
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    loading || setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      // Convert the user's input (DD-MM-YYYY) to database format (YYYY-MM-DD)
      const formattedPasswordForDb = convertToDbDateFormat(password);

      const studentsRef = collection(db, 'students');
      
      // Query using Option A (Nested structure)
      const q = query(
        studentsRef,
        where('contactInfo.email', '==', email.trim().toLowerCase()),
        where('studentInfo.dateOfBirth', '==', formattedPasswordForDb)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let studentData = null;
        querySnapshot.forEach((doc) => {
          studentData = { id: doc.id, ...doc.data() };
        });

        // Clear any stale previous session before writing a new one
        localStorage.removeItem('parentSession');
        sessionStorage.removeItem('parentSession');

        localStorage.setItem('parentSession', JSON.stringify(studentData));
        navigate('parent-dashboard');
      } else {
        setError('Invalid Email or Password.');
      }
    } catch (err) {
      console.error("Login Error: ", err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="role-badge-auth" style={{ background: '#fef3c7', color: '#b45309' }}>
          👨‍👩‍👧 Parent Portal
        </div>

        <h2 className="auth-title">Parent Login</h2>
        <p className="auth-subtitle">Track your child's attendance, results, and school updates.</p>

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
            <label className="form-label">Parent Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="parent@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (Student DOB)</label>
            <div className="password-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="DD-MM-YYYY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth"
            disabled={loading}
            style={{ width: '100%', marginTop: '15px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Verifying...' : 'Login to Parent Portal →'}
          </button>
        </form>

        <div className="form-help">
          Don't have an account? Use your registered contact email and your child's date of birth (DD-MM-YYYY) as the password.
        </div>
      </AuthLayout>
    </div>
  );
}