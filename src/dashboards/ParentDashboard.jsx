import { useState, useEffect, useRef } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import '../components/Sidebar.css';
import './ParentDashboard.css';

const SESSION_KEY = 'parentSession';

export default function ParentDashboard({ navigate, showToast }) {
  const [studentData, setStudentData] = useState(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);

  const db = getFirestore();
  const auth = getAuth();
  const unsubscribeRefs = useRef([]);

  // ── Session guard ──
  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      showToast('Session expired. Please log in again.', 'error');
      navigate('home');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.id) throw new Error('Invalid session');
      setStudentData(parsed);
      setIsSessionLoaded(true);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      showToast('Corrupt session. Please log in again.', 'error');
      navigate('home');
    }
  }, [navigate, showToast]);

  // ── Live Firestore listeners for notices and events ──
  useEffect(() => {
    if (!isSessionLoaded) return;

    const unsubNotices = onSnapshot(
      collection(db, 'notices'),
      (snap) => {
        const data = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setNotices(data);
      },
      (err) => console.error('Notices error:', err)
    );

    const unsubEvents = onSnapshot(
      collection(db, 'events'),
      (snap) => {
        const data = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setEvents(data);
      },
      (err) => console.error('Events error:', err)
    );

    unsubscribeRefs.current = [unsubNotices, unsubEvents];
    return () => {
      unsubscribeRefs.current.forEach((fn) => fn());
      unsubscribeRefs.current = [];
    };
  }, [isSessionLoaded, db]);

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-parent-dashboard .dash-section').forEach((s) =>
      s.classList.remove('active')
    );
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    el.closest('.sidebar').querySelectorAll('.sidebar-item').forEach((i) =>
      i.classList.remove('active')
    );
    el.classList.add('active');
  }

  // ── Complete logout ──
  const handleLogout = () => {
    unsubscribeRefs.current.forEach((fn) => fn());
    unsubscribeRefs.current = [];

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('currentPage');
    sessionStorage.clear();

    setStudentData(null);
    setIsSessionLoaded(false);
    setNotices([]);
    setEvents([]);
    setNewPassword('');
    setConfirmPassword('');

    showToast('Logged out successfully.', 'success');
    navigate('home');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) { showToast('Please enter a new password.', 'error'); return; }
    if (newPassword !== confirmPassword) { showToast('Passwords do not match!', 'error'); return; }
    if (newPassword.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }

    setIsUpdating(true);
    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, newPassword);
        showToast('Password updated successfully!', 'success');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          showToast('Please log out and log back in to perform this action.', 'error');
        } else {
          showToast(error.message, 'error');
        }
      } finally {
        setIsUpdating(false);
      }
    } else {
      showToast('No active user found.', 'error');
      setIsUpdating(false);
    }
  };

  if (!studentData || !isSessionLoaded) return null;

  // Derive display values from nested Firestore structure
  const childName = studentData.studentInfo?.fullName || 'Your Child';
  const childClass = studentData.studentInfo?.class || 'N/A';
  const rollNo = studentData.academicInfo?.rollNumber || 'N/A';
  const parentName = studentData.contactInfo?.parentName || 'Parent';
  const parentEmail = studentData.contactInfo?.email || 'N/A';
  const avatarLetter = parentName.trim().charAt(0).toUpperCase();

  return (
    <div className="dashboard-page" id="page-parent-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="logo-icon">🏫</div>
            <div className="sidebar-brand-name">Indian Springs school</div>
          </div>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">👨‍👩‍👧</div>
          <div className="sidebar-user-name">{parentName}</div>
          <div className="sidebar-user-role">Parent of {childName}</div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active" onClick={(e) => switchDashSection('par-home', e.currentTarget)}><span className="icon">🏠</span>Dashboard</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-attendance', e.currentTarget)}><span className="icon">✅</span>Attendance</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-results', e.currentTarget)}><span className="icon">📊</span>Exam Results</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-homework', e.currentTarget)}><span className="icon">📝</span>Homework</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-feedback', e.currentTarget)}><span className="icon">💬</span>Teacher Feedback</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-announcements', e.currentTarget)}><span className="icon">📣</span>Announcements</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-events', e.currentTarget)}><span className="icon">📅</span>Events</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('par-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-item" onClick={handleLogout} style={{ color: 'rgba(255,100,100,0.8)' }}>
            <span className="icon">🚪</span>Logout
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title">Parent Dashboard</div>
          <div className="topbar-right">
            <div className="topbar-btn">🔔</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>
              {avatarLetter}
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Home */}
          <div className="dash-section active" id="par-home">
            <div className="child-profile-card">
              <div className="child-avatar">👦</div>
              <div>
                <div className="child-name">{childName}</div>
                <div className="child-details">Class {childClass} · Roll No. {rollNo} · Indian Springs School</div>
              </div>
              <div className="child-stats">
                <div className="child-stat"><div className="num">—</div><div className="lab">Overall</div></div>
                <div className="child-stat"><div className="num">—</div><div className="lab">Attendance</div></div>
                <div className="child-stat"><div className="num">—</div><div className="lab">Rank Band</div></div>
              </div>
            </div>

            {notices.length > 0 && (
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-title mb-2">📣 Latest Notices</div>
                {notices.slice(0, 3).map((n) => (
                  <div key={n.id} className="announcement-item" style={{ marginBottom: '0.75rem' }}>
                    <span className="ann-badge badge-notice">{n.target || 'ALL'}</span>
                    <div className="ann-content">
                      <div className="ann-title">{n.title}</div>
                      <div className="ann-meta">{n.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attendance */}
          <div className="dash-section" id="par-attendance">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>✅ Attendance</h2>
            <div className="card">
              <p style={{ color: '#64748b' }}>Attendance records for <strong>{childName}</strong> will be displayed here once the teacher records them.</p>
            </div>
          </div>

          {/* Results */}
          <div className="dash-section" id="par-results">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📊 Exam Results</h2>
            <div className="card">
              <p style={{ color: '#64748b' }}>Exam results for <strong>{childName}</strong> (Class {childClass}, Roll {rollNo}) will appear here once published by the school.</p>
            </div>
          </div>

          {/* Homework */}
          <div className="dash-section" id="par-homework">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📝 Homework &amp; Assignments</h2>
            <div className="card">
              <p style={{ color: '#64748b' }}>Homework assignments for <strong>{childName}</strong> will be listed here once assigned by the teachers.</p>
            </div>
          </div>

          {/* Teacher Feedback */}
          <div className="dash-section" id="par-feedback">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>💬 Teacher Feedback</h2>
            <div className="card">
              <p style={{ color: '#64748b' }}>Teacher feedback for <strong>{childName}</strong> will appear here once submitted.</p>
            </div>
          </div>

          {/* Announcements */}
          <div className="dash-section" id="par-announcements">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📣 School Announcements</h2>
            {notices.length === 0 ? (
              <div className="card"><p style={{ color: '#64748b' }}>No announcements at this time.</p></div>
            ) : (
              <div className="announcements-list">
                {notices.map((n) => (
                  <div key={n.id} className="announcement-item">
                    <span className="ann-badge badge-notice">{n.target || 'ALL'}</span>
                    <div className="ann-content">
                      <div className="ann-title">{n.title}</div>
                      <div className="ann-meta">{n.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events */}
          <div className="dash-section" id="par-events">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Upcoming Events</h2>
            {events.length === 0 ? (
              <div className="card"><p style={{ color: '#64748b' }}>No upcoming events.</p></div>
            ) : (
              <div className="events-grid">
                {events.map((ev) => (
                  <div key={ev.id} className="event-card">
                    <div className="event-info">
                      <div className="event-title">{ev.title}</div>
                      <div className="event-desc">{ev.description}</div>
                      <div className="ann-meta" style={{ marginTop: '0.5rem' }}>{ev.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="dash-section" id="par-profile">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 My Profile Settings</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Account Information</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Account Holder:</strong> {parentName}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Email:</strong> {parentEmail}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Role:</strong> Parent</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Student Name:</strong> {childName} (Class {childClass}A)</p>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Update Password</h3>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type={showNewPassword ? 'text' : 'password'} className="form-input" style={{ paddingRight: '2.5rem', width: '100%' }} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <span style={{ position: 'absolute', right: '12px', cursor: 'pointer', userSelect: 'none', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }} onClick={() => setShowNewPassword(!showNewPassword)}>{showNewPassword ? 'HIDE' : 'SHOW'}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type={showConfirmPassword ? 'text' : 'password'} className="form-input" style={{ paddingRight: '2.5rem', width: '100%' }} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <span style={{ position: 'absolute', right: '12px', cursor: 'pointer', userSelect: 'none', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? 'HIDE' : 'SHOW'}</span>
                  </div>
                </div>
                <button type="submit" className="btn-submit mt-2" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update Password 🔒'}</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
