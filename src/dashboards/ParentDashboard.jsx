import { useState } from 'react';
import { getAuth, updatePassword } from 'firebase/auth'; // Ensure Firebase is initialized in your project
import '../components/Sidebar.css';
import './ParentDashboard.css';

export default function ParentDashboard({ navigate, showToast }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Visibility toggle states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-parent-dashboard .dash-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.closest('.sidebar').querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
  }

  // Firebase Password Update Handler
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      showToast('Please enter a new password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password should be at least 6 characters long.', 'error');
      return;
    }

    setIsUpdating(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        showToast('Password updated successfully!', 'success');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
          showToast('Please log out and log back in to perform this action.', 'error');
        } else {
          showToast(error.message, 'error');
        }
      } finally {
        setIsUpdating(false);
      }
    } else {
      showToast('No logged in user found.', 'error');
      setIsUpdating(false);
    }
  };

  return (
    <div className="dashboard-page" id="page-parent-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="logo-icon">🏫</div><div className="sidebar-brand-name">Vidyalaya</div></div></div>
        <div className="sidebar-user"><div className="sidebar-avatar">👨‍👩‍👧</div><div className="sidebar-user-name">Mr. &amp; Mrs. Sharma</div><div className="sidebar-user-role">Parent of Arjun Sharma</div></div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active" onClick={(e) => switchDashSection('par-home', e.currentTarget)}><span className="icon">🏠</span>Dashboard</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-attendance', e.currentTarget)}><span className="icon">✅</span>Attendance</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-results', e.currentTarget)}><span className="icon">📊</span>Exam Results</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-homework', e.currentTarget)}><span className="icon">📝</span>Homework</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-feedback', e.currentTarget)}><span className="icon">💬</span>Teacher Feedback</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-announcements', e.currentTarget)}><span className="icon">📣</span>Announcements</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-events', e.currentTarget)}><span className="icon">📅</span>Events</div>
          {/* Added My Profile Option */}
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
        </nav>
        <div className="sidebar-footer"><div className="sidebar-item" onClick={() => navigate('home')} style={{ color: 'rgba(255,100,100,0.8)' }}><span className="icon">🚪</span>Logout</div></div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title">Parent Dashboard</div>
          <div className="topbar-right">
            <div className="topbar-btn">🔔</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>S</div>
          </div>
        </div>
        <div className="dashboard-content">

          {/* Home */}
          <div className="dash-section active" id="par-home">
            <div className="child-profile-card">
              <div className="child-avatar">👦</div>
              <div><div className="child-name">Arjun Sharma</div><div className="child-details">Class 10A · Roll No. VID2024042 · Vidyalaya School</div></div>
              <div className="child-stats">
                <div className="child-stat"><div className="num">87%</div><div className="lab">Overall</div></div>
                <div className="child-stat"><div className="num">94%</div><div className="lab">Attendance</div></div>
                <div className="child-stat"><div className="num">A+</div><div className="lab">Rank Band</div></div>
              </div>
            </div>
            <div className="cards-grid">
              <div className="card"><div className="card-title mb-2">📊 Recent Performance</div>
                <div className="progress-bar-wrap"><div className="progress-label"><span>Mathematics</span><span style={{ fontWeight: 700, color: 'var(--success)' }}>92%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '92%' }}></div></div></div>
                <div className="progress-bar-wrap"><div className="progress-label"><span>Physics</span><span style={{ fontWeight: 700, color: 'var(--secondary)' }}>88%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '88%' }}></div></div></div>
                <div className="progress-bar-wrap"><div className="progress-label"><span>Chemistry</span><span style={{ fontWeight: 700, color: 'var(--secondary)' }}>85%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '85%' }}></div></div></div>
              </div>
              <div className="card"><div className="card-title mb-2">✅ Attendance Summary</div>
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--success)' }}>94%</div>
                  <div className="text-muted text-sm mt-1">113 / 120 days present</div>
                  <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}><span className="status-badge status-active">Present: 113</span><span className="status-badge status-inactive">Absent: 7</span></div>
                </div>
              </div>
              <div className="card"><div className="card-title mb-2">📝 Pending Homework</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px', borderLeft: '3px solid var(--danger)' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Math — Exercise 5.3</div><div className="text-muted text-sm">Due: Dec 5, 2026</div></div>
                  <div style={{ padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px', borderLeft: '3px solid var(--warning)' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Physics — Lab Report</div><div className="text-muted text-sm">Due: Dec 8, 2026</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="dash-section" id="par-attendance">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>✅ Attendance Tracking</h2>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--success)' }}>113</div><div className="text-muted text-sm">Days Present</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--danger)' }}>7</div><div className="text-muted text-sm">Days Absent</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>94%</div><div className="text-muted text-sm">Attendance</div></div>
              </div>
              <div className="progress-bar-wrap"><div className="progress-label"><span>Nov 2026</span><span style={{ fontWeight: 700 }}>96%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '96%' }}></div></div></div>
              <div className="progress-bar-wrap"><div className="progress-label"><span>Oct 2026</span><span style={{ fontWeight: 700 }}>92%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '92%' }}></div></div></div>
              <div className="progress-bar-wrap"><div className="progress-label"><span>Sep 2026</span><span style={{ fontWeight: 700 }}>95%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '95%' }}></div></div></div>
            </div>
          </div>

          {/* Results */}
          <div className="dash-section" id="par-results">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📊 Exam Results — Term 1</h2>
            <div className="result-card"><div className="result-header"><div className="result-subject">Mathematics</div><div className="result-grade grade-A">A+ (92%)</div></div><div className="progress-track"><div className="progress-fill" style={{ width: '92%' }}></div></div></div>
            <div className="result-card"><div className="result-header"><div className="result-subject">Physics</div><div className="result-grade grade-A">A (88%)</div></div><div className="progress-track"><div className="progress-fill" style={{ width: '88%' }}></div></div></div>
            <div className="result-card"><div className="result-header"><div className="result-subject">Chemistry</div><div className="result-grade grade-A">A (85%)</div></div><div className="progress-track"><div className="progress-fill" style={{ width: '85%' }}></div></div></div>
            <div className="result-card"><div className="result-header"><div className="result-subject">English</div><div className="result-grade grade-B">B+ (79%)</div></div><div className="progress-track"><div className="progress-fill" style={{ width: '79%' }}></div></div></div>
            <div className="result-card"><div className="result-header"><div className="result-subject">Social Studies</div><div className="result-grade grade-A">A (83%)</div></div><div className="progress-track"><div className="progress-fill" style={{ width: '83%' }}></div></div></div>
          </div>

          {/* Homework */}
          <div className="dash-section" id="par-homework">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📝 Homework &amp; Assignments</h2>
            <div className="announcements-list">
              <div className="announcement-item"><span className="ann-badge badge-notice">PENDING</span><div className="ann-content"><div className="ann-title">Mathematics — Exercise 5.3 (Quadratic Equations)</div><div className="ann-meta">Assigned by Mr. Kumar · Due Dec 5, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-notice">PENDING</span><div className="ann-content"><div className="ann-title">Physics — Lab Report: Reflection of Light</div><div className="ann-meta">Assigned by Ms. Priya · Due Dec 8, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-new">SUBMITTED</span><div className="ann-content"><div className="ann-title">English — Essay: My Favourite Book</div><div className="ann-meta">Assigned by Mrs. Rao · Submitted Nov 30, 2026</div></div></div>
            </div>
          </div>

          {/* Teacher Feedback */}
          <div className="dash-section" id="par-feedback">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>💬 Teacher Feedback</h2>
            <div className="announcements-list">
              <div className="announcement-item"><span className="ann-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>Ms. Priya</span><div className="ann-content"><div className="ann-title">Arjun shows great aptitude in Physics. Encourage him to practice numerical problems daily for board prep.</div><div className="ann-meta">Physics Teacher · Nov 28, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Mr. Kumar</span><div className="ann-content"><div className="ann-title">Mathematics performance is excellent. Arjun consistently ranks in the top 3 of class.</div><div className="ann-meta">Mathematics Teacher · Nov 25, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge" style={{ background: '#fef3c7', color: '#b45309' }}>Mrs. Rao</span><div className="ann-content"><div className="ann-title">English composition could be improved. Encourage daily reading and writing practice at home.</div><div className="ann-meta">English Teacher · Nov 22, 2026</div></div></div>
            </div>
          </div>

          {/* Announcements */}
          <div className="dash-section" id="par-announcements">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📣 School Announcements</h2>
            <div className="announcements-list">
              <div className="announcement-item"><span className="ann-badge badge-new">NEW</span><div className="ann-content"><div className="ann-title">Parent-Teacher Meeting — December 14, 2026</div><div className="ann-meta">Principal's Office · Dec 2, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-notice">NOTICE</span><div className="ann-content"><div className="ann-title">Fee Payment Deadline — December 15, 2026</div><div className="ann-meta">Accounts Office · Nov 30, 2026</div></div></div>
            </div>
          </div>

          {/* Events */}
          <div className="dash-section" id="par-events">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Upcoming Events</h2>
            <div className="events-grid">
              <div className="event-card"><div className="event-date-bar"><div><div className="event-day">14</div><div className="event-month">Dec</div></div><span>PTM</span></div><div className="event-info"><div className="event-title">Parent-Teacher Meeting</div><div className="event-desc">Review your child's progress with teachers</div></div></div>
              <div className="event-card"><div className="event-date-bar"><div><div className="event-day">15</div><div className="event-month">Dec</div></div><span>Sports</span></div><div className="event-info"><div className="event-title">Annual Sports Day</div><div className="event-desc">Arjun is participating in the 400m race!</div></div></div>
            </div>
          </div>

          {/* Added Parent My Profile Container */}
          <div className="dash-section" id="par-profile">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 My Profile Settings</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Account Information</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Account Holder:</strong> Mr. &amp; Mrs. Sharma</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Role:</strong> Parent</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Registered Ward:</strong> Arjun Sharma</p>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Update Password</h3>
                
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      className="form-input" 
                      style={{ paddingRight: '2.5rem', width: '100%' }}
                      placeholder="Enter new password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span 
                      style={{ position: 'absolute', right: '12px', cursor: 'pointer', userSelect: 'none', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? 'HIDE' : 'SHOW'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      className="form-input" 
                      style={{ paddingRight: '2.5rem', width: '100%' }}
                      placeholder="Confirm new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <span 
                      style={{ position: 'absolute', right: '12px', cursor: 'pointer', userSelect: 'none', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'HIDE' : 'SHOW'}
                    </span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-submit mt-2" 
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Password 🔒'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}