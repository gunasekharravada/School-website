import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import './AdminLoginPage.css';

// 1. Import auth from your firebase config file and the sign-in function from SDK
import { auth } from '../firebase/firebaseconfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage({ navigate, showToast }) {
  // 2. Set up local state to capture input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. Handle Firebase Authentication on submit
  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      if (showToast) showToast('Please fill in all fields.', 'danger');
      return;
    }

    setIsLoading(true);

    try {
      // Send credentials to Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      if (showToast) showToast('Welcome back, Administrator!', 'success');
      navigate('admin-dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error("Login Error: ", error.code, error.message);
      
      // Provide a clean error message to the user
      let friendlyMessage = 'Invalid credentials. Please try again.';
      if (error.code === 'auth/invalid-email') friendlyMessage = 'Please enter a valid email address.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        friendlyMessage = 'Incorrect email or password.';
      }

      if (showToast) showToast(friendlyMessage, 'danger');
    } finally {
      setIsLoading(false);
    }
  }

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
        
        {/* Wrap inputs in a form component to support pressing "Enter" to submit */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input 
              className="form-input" 
              type="email" 
              placeholder="admin@vidyalaya.edu.in" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              placeholder="Enter admin password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            className="btn-auth" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Access Admin Panel →'}
          </button>
        </form>

        <div className="form-help">Admin access is restricted. Unauthorized login attempts are logged.</div>
      </AuthLayout>
    </div>
  );
}