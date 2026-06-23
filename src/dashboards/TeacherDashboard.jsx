import { useState, useEffect, useRef } from 'react';
import { getAuth, updatePassword, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import '../components/Sidebar.css';
import './TeacherDashboard.css';

const SESSION_KEY = 'teacherSession';

export default function TeacherDashboard({ navigate, showToast }) {
  const [teacher, setTeacher] = useState(null);
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

  // ── Session guard: load teacher data from localStorage, redirect if missing ──
  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      showToast('Session expired. Please log in again.', 'error');
      navigate('home');
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.id) throw new Error('Invalid session data');
      setTeacher(parsed);
      setIsSessionLoaded(true);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      showToast('Corrupt session. Please log in again.', 'error');
      navigate('home');
    }
  }, [navigate, showToast]);

  // ── Live Firestore listeners (only after session confirmed) ──
  useEffect(() => {
    if (!isSessionLoaded) return;

    const noticesRef = collection(db, 'notices');
    const unsubNotices = onSnapshot(
      noticesRef,
      (snap) => {
        const data = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setNotices(data);
      },
      (err) => console.error('Notices listener error:', err)
    );

    const eventsRef = collection(db, 'events');
    const unsubEvents = onSnapshot(
      eventsRef,
      (snap) => {
        const data = [];
        snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
        setEvents(data);
      },
      (err) => console.error('Events listener error:', err)
    );

    unsubscribeRefs.current = [unsubNotices, unsubEvents];

    return () => {
      unsubscribeRefs.current.forEach((fn) => fn());
      unsubscribeRefs.current = [];
    };
  }, [isSessionLoaded, db]);

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-teacher-dashboard .dash-section').forEach((s) =>
      s.classList.remove('active')
    );
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    el.closest('.sidebar').querySelectorAll('.sidebar-item').forEach((i) =>
      i.classList.remove('active')
    );
    el.classList.add('active');
  }

  // ── Complete logout: Firebase signOut + clear all storage + reset state ──
  const handleLogout = async () => {
    // 1. Detach Firestore listeners immediately
    unsubscribeRefs.current.forEach((fn) => fn());
    unsubscribeRefs.current = [];

    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase signOut error:', err);
    }

    // 2. Wipe all session traces
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('currentPage');
    sessionStorage.clear();

    // 3. Reset all React state to clean defaults
    setTeacher(null);
    setIsSessionLoaded(false);
    setNotices([]);
    setEvents([]);
    setNewPassword('');
    setConfirmPassword('');

    showToast('Logged out successfully. Session closed.', 'success');
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
      showToast('No active user found. Please log in again.', 'error');
      setIsUpdating(false);
    }
  };

  // Render nothing until session is verified
  if (!teacher || !isSessionLoaded) return null;

  const avatarLetter = teacher.teacherName ? teacher.teacherName.trim().charAt(0).toUpperCase() : 'T';
  const assignedCount = Array.isArray(teacher.assignedClasses) ? teacher.assignedClasses.length : 0;

  return (
    <div className="dashboard-page" id="page-teacher-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="logo-icon">🏫</div>
            <div className="sidebar-brand-name">Indian Springs School</div>
          </div>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">👩‍🏫</div>
          <div className="sidebar-user-name">{teacher.teacherName}</div>
          <div className="sidebar-user-role">{teacher.role || 'Teacher'}</div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active" onClick={(e) => switchDashSection('tch-home', e.currentTarget)}><span className="icon">🏠</span>Dashboard</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-classes', e.currentTarget)}><span className="icon">🏫</span>My Classes</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-upload', e.currentTarget)}><span className="icon">📤</span>Upload Materials</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-quiz', e.currentTarget)}><span className="icon">📝</span>Create Quiz</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-students', e.currentTarget)}><span className="icon">👥</span>Student Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-announcements', e.currentTarget)}><span className="icon">📣</span>Announcements</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-events', e.currentTarget)}><span className="icon">📅</span>Events</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-feedback', e.currentTarget)}><span className="icon">⭐</span>Feedback</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-item" onClick={handleLogout} style={{ color: 'rgba(255,100,100,0.8)' }}>
            <span className="icon">🚪</span>Logout
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title">Teacher Dashboard</div>
          <div className="topbar-right">
            <div className="topbar-btn">🔔</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>
              {avatarLetter}
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Home */}
          <div className="dash-section active" id="tch-home">
            <div className="welcome-banner">
              <div className="welcome-title">Welcome back, {teacher.teacherName}! 👩‍🏫</div>
              <div className="welcome-subtitle">{teacher.department || 'Academic'} Department · {assignedCount} Classes Assigned</div>
            </div>

            {/* Live Notices */}
            {notices.length > 0 && (
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <div className="card-title mb-2">📣 Recent Notices</div>
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

          {/* Classes */}
          <div className="dash-section" id="tch-classes">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🏫 My Classes</h2>
            {assignedCount > 0 ? (
              <div className="cards-grid">
                {(Array.isArray(teacher.assignedClasses) ? teacher.assignedClasses : []).map((cls, i) => (
                  <div key={i} className="card">
                    <div className="card-title">Class {cls}</div>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Subject: {Array.isArray(teacher.subjects) ? teacher.subjects.join(', ') : teacher.subjects || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card"><p style={{ color: '#64748b' }}>No classes assigned yet. Contact the administrator.</p></div>
            )}
          </div>

          {/* Upload Materials */}
          <div className="dash-section" id="tch-upload">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📤 Upload Materials</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div className="form-group"><label className="form-label">Select Class</label><select className="form-select">{(Array.isArray(teacher.assignedClasses) ? teacher.assignedClasses : []).map((c, i) => <option key={i}>Class {c}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Subject</label><input className="form-input" defaultValue={Array.isArray(teacher.subjects) ? teacher.subjects[0] : teacher.subjects || ''} /></div>
              <div className="form-group"><label className="form-label">Upload File</label><input className="form-input" type="file" /></div>
              <button className="btn-submit" onClick={() => showToast('File upload coming soon!', 'success')}>Upload Material</button>
            </div>
          </div>

          {/* Create Quiz */}
          <div className="dash-section" id="tch-quiz">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📝 Create Quiz</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div className="form-group"><label className="form-label">Quiz Title</label><input className="form-input" placeholder="e.g., Chapter 3 Quiz" /></div>
              <div className="form-group"><label className="form-label">Target Class</label><select className="form-select">{(Array.isArray(teacher.assignedClasses) ? teacher.assignedClasses : []).map((c, i) => <option key={i}>Class {c}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Duration (minutes)</label><input className="form-input" type="number" defaultValue={30} /></div>
              <button className="btn-submit" onClick={() => showToast('Quiz creation coming soon!', 'success')}>Create Quiz</button>
            </div>
          </div>

          {/* Student Management */}
          <div className="dash-section" id="tch-students">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👥 Student Management</h2>
            <div className="card"><p style={{ color: '#64748b' }}>Student roster management features coming soon. You can view your assigned classes in the My Classes section.</p></div>
          </div>

          {/* Announcements */}
          <div className="dash-section" id="tch-announcements">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📣 Announcements</h2>
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
          <div className="dash-section" id="tch-events">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Events</h2>
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

          {/* Feedback */}
          <div className="dash-section" id="tch-feedback">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>⭐ Feedback</h2>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div className="form-group"><label className="form-label">Feedback Category</label><select className="form-select"><option>Teaching Tools</option><option>Curriculum</option><option>Administration</option><option>Infrastructure</option><option>Other</option></select></div>
              <div className="form-group"><label className="form-label">Your Feedback</label><textarea className="form-textarea" placeholder="Share your feedback..."></textarea></div>
              <button className="btn-submit" onClick={() => showToast('Feedback submitted successfully!', 'success')}>Submit Feedback</button>
            </div>
          </div>

          {/* Profile */}
          <div className="dash-section" id="tch-profile">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 My Profile Settings</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Account Information</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Name:</strong> {teacher.teacherName}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Employee ID:</strong> {teacher.employeeId || 'N/A'}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Email:</strong> {teacher.contactInfo?.email || 'N/A'}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Department:</strong> {teacher.department || 'N/A'}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Role:</strong> {teacher.role || 'Teacher'}</p>
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
