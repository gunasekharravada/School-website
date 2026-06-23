import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig'; 
import AuthLayout from './AuthLayout';
import './StudentLoginPage.css';
// 1. Imported the js-cookie library
import Cookies from 'js-cookie';

export default function StudentLoginPage({ navigate }) {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to convert DD-MM-YYYY or DD/MM/YYYY to YYYY-MM-DD
  const convertToDbDateFormat = (dateString) => {
    const cleanDate = dateString.replace(/[\/.]/g, '-').trim();
    const parts = cleanDate.split('-');
    
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // Clear any previous session before attempting login
  Cookies.remove('studentSession', { path: '/' });
  localStorage.clear();
  sessionStorage.clear();

  if (!rollNumber.trim() || !password.trim()) {
    setError('Please fill in both Roll Number and Password.');
    setLoading(false);
    return;
  }

  try {
    const formattedPasswordForDb = convertToDbDateFormat(password);

    const studentsRef = collection(db, 'students');

    const q = query(
      studentsRef,
      where('academicInfo.rollNumber', '==', rollNumber.trim()),
      where('studentInfo.dateOfBirth', '==', formattedPasswordForDb)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let studentData = null;

      querySnapshot.forEach((doc) => {
        studentData = {
          id: doc.id,
          ...doc.data()
        };
      });

      // Extra safety: remove any old session again
      // Remove any previous session
Cookies.remove('studentSession', { path: '/' });

localStorage.removeItem('studentSession');
sessionStorage.removeItem('studentSession');

// Save fresh session
Cookies.set(
  'studentSession',
  JSON.stringify(studentData),
  {
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: 7
  }
);

// Optional backup storage
localStorage.setItem(
  'studentSession',
  JSON.stringify(studentData)
);

// Navigate
navigate('student-dashboard');
    } else {
      setError('Invalid Roll Number or Password (DOB). Please try again.');
    }
  } catch (err) {
    console.error('Error during student login:', err);
    setError('An error occurred. Please try again later.');
  } finally {
    setLoading(false);
  }
};

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
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input 
              className="form-input" 
              placeholder="e.g., 12345678" 
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password (Date of Birth)</label>
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                type={showPassword ? "text" : "password"} 
                placeholder="DD-MM-YYYY" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{ width: '100%', paddingRight: '40px' }} 
                required
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  fontSize: '18px',
                  zIndex: 10
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>
          
          <button 
            type="submit"
            className="btn-auth" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Verifying...' : 'Login to Student Portal →'}
          </button>
        </form>

        <div className="form-help">
          Forgot password? Contact your class teacher or <a style={{ color: 'var(--secondary)', cursor: 'pointer' }}>reset via email</a>.
        </div>
      </AuthLayout>
    </div>
  );
}