import { useState } from 'react';
import { getAuth, updatePassword } from 'firebase/auth'; // Ensure Firebase is initialized in your project
import '../components/Sidebar.css';
import './TeacherDashboard.css';

export default function TeacherDashboard({ navigate, showToast }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // States to track password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-teacher-dashboard .dash-section').forEach(s => s.classList.remove('active'));
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
    <div className="dashboard-page" id="page-teacher-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="logo-icon">🏫</div><div className="sidebar-brand-name">Vidyalaya</div></div></div>
        <div className="sidebar-user"><div className="sidebar-avatar">👩‍🏫</div><div className="sidebar-user-name">Priya Mehta</div><div className="sidebar-user-role">Senior Physics Teacher</div></div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active" onClick={(e) => switchDashSection('tch-home', e.currentTarget)}><span className="icon">🏠</span>Dashboard</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-classes', e.currentTarget)}><span className="icon">🏫</span>My Classes</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-upload', e.currentTarget)}><span className="icon">📤</span>Upload Materials</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-quiz', e.currentTarget)}><span className="icon">📝</span>Create Quiz</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-students', e.currentTarget)}><span className="icon">👥</span>Student Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-announcements', e.currentTarget)}><span className="icon">📣</span>Announcements</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-events', e.currentTarget)}><span className="icon">📅</span>Events</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-feedback', e.currentTarget)}><span className="icon">⭐</span>Feedback</div>
          {/* My Profile Section Link */}
          <div className="sidebar-item" onClick={(e) => switchDashSection('tch-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
        </nav>
        <div className="sidebar-footer"><div className="sidebar-item" onClick={() => navigate('home')} style={{ color: 'rgba(255,100,100,0.8)' }}><span className="icon">🚪</span>Logout</div></div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title">Teacher Dashboard</div>
          <div className="topbar-right">
            <div className="topbar-btn">🔔</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>P</div>
          </div>
        </div>
        <div className="dashboard-content">

          {/* Home */}
          <div className="dash-section active" id="tch-home">
            <div className="welcome-banner"><div className="welcome-title">Welcome back, Ms. Priya! 👩‍🏫</div><div className="welcome-subtitle">Physics Department · 4 Classes Today</div></div>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-icon" style={{ background: '#eff6ff' }}>👥</div><div className="stat-data"><div className="num">168</div><div className="label">Total Students</div></div></div>
              <div className="stat-card"><div className="stat-icon" style={{ background: '#f0fdf4' }}>📚</div><div className="stat-data"><div className="num">4</div><div className="label">Classes Assigned</div></div></div>
              <div className="stat-card"><div className="stat-icon" style={{ background: '#fef3c7' }}>📤</div><div className="stat-data"><div className="num">24</div><div className="label">Materials Uploaded</div></div></div>
              <div className="stat-card"><div className="stat-icon" style={{ background: '#fef2f2' }}>📝</div><div className="stat-data"><div className="num">8</div><div className="label">Quizzes Created</div></div></div>
            </div>
          </div>

          {/* My Classes */}
          <div className="dash-section" id="tch-classes">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🏫 My Classes</h2>
            <div className="class-cards">
              <div className="class-card"><div className="class-card-num">10A</div><div className="class-card-label">Physics</div><div className="class-card-count">42 students</div></div>
              <div className="class-card"><div className="class-card-num">10B</div><div className="class-card-label">Physics</div><div className="class-card-count">40 students</div></div>
              <div className="class-card"><div className="class-card-num">11A</div><div className="class-card-label">Physics</div><div className="class-card-count">44 students</div></div>
              <div className="class-card"><div className="class-card-num">12A</div><div className="class-card-label">Physics</div><div className="class-card-count">42 students</div></div>
            </div>
          </div>

          {/* Upload Materials */}
          <div className="dash-section" id="tch-upload">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📤 Upload Study Materials</h2>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div className="form-group"><label className="form-label">Select Class</label><select className="form-select"><option>Select Class</option><option>Class 10A</option><option>Class 10B</option><option>Class 11A</option><option>Class 12A</option></select></div>
              <div className="form-group"><label className="form-label">Select Subject</label><select className="form-select"><option>Physics</option><option>Mathematics</option><option>Chemistry</option></select></div>
              <div className="form-group"><label className="form-label">Material Title</label><input className="form-input" placeholder="e.g., Wave Optics — Chapter Notes" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" style={{ minHeight: '80px' }} placeholder="Brief description of the material..."></textarea></div>
              <div className="gallery-upload-zone" onClick={() => showToast('Upload ready for backend integration', '')}>
                <div className="upload-icon">📄</div>
                <div className="upload-text">Click to upload PDF</div>
                <div className="upload-hint">PDF files only, max 20MB</div>
              </div>
              <button className="btn-submit mt-3" onClick={() => showToast('Material uploaded successfully!', 'success')}>Upload Material 📤</button>
            </div>
          </div>

          {/* Create Quiz */}
          <div className="dash-section" id="tch-quiz">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📝 Create Quiz</h2>
            <div className="card" style={{ maxWidth: '650px' }}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Class</label><select className="form-select"><option>Class 10A</option><option>Class 10B</option></select></div>
                <div className="form-group"><label className="form-label">Subject</label><select className="form-select"><option>Physics</option><option>Mathematics</option></select></div>
              </div>
              <div className="form-group"><label className="form-label">Quiz Title</label><input className="form-input" placeholder="e.g., Wave Optics Practice Quiz" /></div>
              <div className="divider"></div>
              <div style={{ fontWeight: 700, marginBottom: '1rem' }}>Question 1</div>
              <div className="form-group"><label className="form-label">Question Text</label><textarea className="form-textarea" style={{ minHeight: '80px' }} placeholder="Enter your question here..."></textarea></div>
              <div className="form-group"><label className="form-label">Option A</label><input className="form-input" placeholder="Option A" /></div>
              <div className="form-group"><label className="form-label">Option B</label><input className="form-input" placeholder="Option B" /></div>
              <div className="form-group"><label className="form-label">Option C</label><input className="form-input" placeholder="Option C" /></div>
              <div className="form-group"><label className="form-label">Option D</label><input className="form-input" placeholder="Option D" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Correct Answer</label><select className="form-select"><option>A</option><option>B</option><option>C</option><option>D</option></select></div>
                <div className="form-group"><label className="form-label">Marks</label><input className="form-input" type="number" defaultValue="1" min="1" /></div>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button className="btn-secondary" onClick={() => showToast('New question field added', '')}>+ Add Question</button>
                <button className="btn-submit" onClick={() => showToast('Quiz published successfully!', 'success')}>Publish Quiz 📝</button>
              </div>
            </div>
          </div>

          {/* Student Management */}
          <div className="dash-section" id="tch-students">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👥 Student Management — Class 10A</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div className="student-mgmt-card"><div className="student-circle" style={{ background: '#1e3a8a' }}>A</div><div className="student-info"><div className="student-name">Arjun Sharma</div><div className="student-class">Roll: VID2024042 · Score: 87%</div><div className="attendance-bar"><span className="att-label">Attendance:</span><div className="att-track"><div className="att-fill" style={{ width: '94%', background: 'var(--success)' }}></div></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>94%</span></div></div><span className="status-badge status-active">Active</span></div>
              <div className="student-mgmt-card"><div className="student-circle" style={{ background: '#0ea5e9' }}>P</div><div className="student-info"><div className="student-name">Preethi Nair</div><div className="student-class">Roll: VID2024043 · Score: 91%</div><div className="attendance-bar"><span className="att-label">Attendance:</span><div className="att-track"><div className="att-fill" style={{ width: '97%', background: 'var(--success)' }}></div></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>97%</span></div></div><span className="status-badge status-active">Active</span></div>
              <div className="student-mgmt-card"><div className="student-circle" style={{ background: '#f59e0b' }}>R</div><div className="student-info"><div className="student-name">Rahul Gupta</div><div className="student-class">Roll: VID2024044 · Score: 72%</div><div className="attendance-bar"><span className="att-label">Attendance:</span><div className="att-track"><div className="att-fill" style={{ width: '78%', background: 'var(--warning)' }}></div></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--warning)' }}>78%</span></div></div><span className="status-badge status-pending">Review</span></div>
              <div className="student-mgmt-card"><div className="student-circle" style={{ background: '#10b981' }}>S</div><div className="student-info"><div className="student-name">Sana Khan</div><div className="student-class">Roll: VID2024045 · Score: 95%</div><div className="attendance-bar"><span className="att-label">Attendance:</span><div className="att-track"><div className="att-fill" style={{ width: '99%', background: 'var(--success)' }}></div></div><span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>99%</span></div></div><span className="status-badge status-active">Active</span></div>
            </div>
          </div>

          {/* Announcements */}
          <div className="dash-section" id="tch-announcements">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📣 Post Announcement</h2>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div className="form-group"><label className="form-label">Target Audience</label><select className="form-select"><option>Class 10A</option><option>Class 10B</option><option>All Students</option></select></div>
              <div className="form-group"><label className="form-label">Announcement Title</label><input className="form-input" placeholder="e.g., Assignment Due Reminder" /></div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Write your announcement..."></textarea></div>
              <button className="btn-submit" onClick={() => showToast('Announcement posted!', 'success')}>Post Announcement 📣</button>
            </div>
          </div>

          {/* Events */}
          <div className="dash-section" id="tch-events">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Events</h2>
            <div className="events-grid">
              <div className="event-card"><div className="event-date-bar"><div><div className="event-day">14</div><div className="event-month">Dec</div></div><span>PTM</span></div><div className="event-info"><div className="event-title">Parent-Teacher Meeting</div><div className="event-desc">Review sessions with parents</div></div></div>
              <div className="event-card"><div className="event-date-bar"><div><div className="event-day">18</div><div className="event-month">Dec</div></div><span>Academic</span></div><div className="event-info"><div className="event-title">Science Fair</div><div className="event-desc">Student project presentations</div></div></div>
            </div>
          </div>

          {/* Feedback */}
          <div className="dash-section" id="tch-feedback">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>⭐ Student Feedback Received</h2>
            <div className="announcements-list">
              <div className="announcement-item"><span className="ann-badge" style={{ background: '#fef3c7', color: '#b45309' }}>★★★★★</span><div className="ann-content"><div className="ann-title">Physics classes are incredibly engaging. Ms. Priya explains concepts with real-world examples.</div><div className="ann-meta">Anonymous Student · Class 10A · Dec 1, 2024</div></div></div>
              <div className="announcement-item"><span className="ann-badge" style={{ background: '#fef3c7', color: '#b45309' }}>★★★★☆</span><div className="ann-content"><div className="ann-title">Good teaching but would appreciate more practice problems before exams.</div><div className="ann-meta">Anonymous Student · Class 11A · Nov 28, 2024</div></div></div>
            </div>
          </div>

          {/* My Profile Container with standard text hide/show icons */}
          <div className="dash-section" id="tch-profile">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 My Profile Settings</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Account Information</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Name:</strong> Ms. Priya Mehta</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Role:</strong> Senior Physics Teacher</p>
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