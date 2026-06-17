import React, { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig'; 
import AuthLayout from './AuthLayout';
import './StudentLoginPage.css';

export default function StudentLoginPage({ navigate }) {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!rollNumber.trim() || !password.trim()) {
      setError('Please fill in both Roll Number and Password.');
      setLoading(false);
      return;
    }

    try {
      const studentsRef = collection(db, 'students');
      const q = query(
        studentsRef, 
        where('academicInfo.rollNumber', '==', rollNumber.trim()),
        where('studentInfo.dateOfBirth', '==', password.trim())
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let studentData = null;
        querySnapshot.forEach((doc) => {
          studentData = { id: doc.id, ...doc.data() };
        });

        localStorage.setItem('currentStudent', JSON.stringify(studentData));
        navigate('student-dashboard');
      } else {
        setError('Invalid Roll Number or Password (DOB). Please try again.');
      }
    } catch (err) {
      console.error("Error during student login:", err);
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
              placeholder="e.g., VID2024001" 
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password (Date of Birth)</label>
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                type={showPassword ? "text" : "password"} 
                placeholder="YYYY-MM-DD" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{ width: '100%', paddingRight: '40px' }} 
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