import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import './AdminLoginPage.css';

// 1. Import auth and db from your firebase config file
import { auth, db } from '../firebase/firebaseconfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
// Import the necessary Firestore SDK methods
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminLoginPage({ navigate, showToast }) {
  // 2. Set up local state to capture input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. Handle Firebase Authentication and Firestore Initialization on submit
  async function handleLogin(e) {
    e.preventDefault();

    if (!email || !password) {
      if (showToast) showToast('Please fill in all fields.', 'danger');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate credentials against Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // This gives us the unique user UID
      
      // 2. Reference the admin document using the unique UID
      const adminDocRef = doc(db, 'admins', user.uid);
      const adminDocSnap = await getDoc(adminDocRef);

      // 3. Check if the admin details already exist in Cloud Firestore
      if (!adminDocSnap.exists()) {
        // If the document doesn't exist, create it with placeholder info
        await setDoc(adminDocRef, {
          fullName: 'Indian Spring School Admin', // Default fallback name
          email: user.email,                      // Admin email from auth
          contactNumber: 'Not Added',              // Placeholder contact number
          role: 'ADMIN',                          // Enforcing the role
          createdAt: serverTimestamp()            // Track account initialization
        });
        console.log("New admin record initialized in Firestore!");
      }

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