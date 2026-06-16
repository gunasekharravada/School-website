import '../components/Sidebar.css';
import './AdminDashboard.css';
// 1. Import auth from your newly created firebase config file
import { auth } from '../firebase/firebaseconfig'; 
// 2. Import the signOut function from the Firebase SDK
import { signOut } from 'firebase/auth';

export default function AdminDashboard({ navigate, showToast }) {
  
  // Handle secure logout via Firebase
  async function handleLogout() {
    try {
      await signOut(auth);
      showToast('Logged out successfully', 'success');
      navigate('home'); // Redirect to home page after sign out
    } catch (error) {
      console.error("Logout Error: ", error.message);
      showToast('Failed to log out smoothly. Please try again.', 'danger');
    }
  }

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-admin-dashboard .dash-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.closest('.sidebar').querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
  }

  return (
    <div className="dashboard-page" id="page-admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="logo-icon">🏫</div><div className="sidebar-brand-name">Vidyalaya</div></div></div>
        <div className="sidebar-user"><div className="sidebar-avatar">⚙️</div><div className="sidebar-user-name">Dr. Rajan Iyer</div><div className="sidebar-user-role">Principal &amp; Administrator</div></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Core</div>
          <div className="sidebar-item active" onClick={(e) => switchDashSection('adm-home', e.currentTarget)}><span className="icon">🏠</span>Dashboard</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-students', e.currentTarget)}><span className="icon">🎓</span>Student Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-teachers', e.currentTarget)}><span className="icon">👩‍🏫</span>Teacher Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-admissions', e.currentTarget)}><span className="icon">📋</span>Admissions</div>
          <div className="sidebar-section-label">Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-notices', e.currentTarget)}><span className="icon">📣</span>Notice Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-events', e.currentTarget)}><span className="icon">📅</span>Event Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-gallery', e.currentTarget)}><span className="icon">🖼️</span>Gallery Management</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-settings', e.currentTarget)}><span className="icon">⚙️</span>Settings</div>
        </nav>
        {/* 3. Updated the Logout click handler to use our new handleLogout function */}
        <div className="sidebar-footer">
          <div className="sidebar-item" onClick={handleLogout} style={{ color: 'rgba(255,100,100,0.8)' }}>
            <span className="icon">🚪</span>Logout
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title">Admin Panel</div>
          <div className="topbar-right">
            <div className="topbar-btn">🔔</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>R</div>
          </div>
        </div>
        <div className="dashboard-content">

          {/* Home */}
          <div className="dash-section active" id="adm-home">
            <div className="welcome-banner"><div className="welcome-title">Admin Dashboard 🏫</div><div className="welcome-subtitle">Vidyalaya School of Excellence · Academic Year 2025–26</div></div>
            <div className="admin-stat-cards">
              <div className="admin-stat"><div className="admin-stat-num">4,218</div><div className="admin-stat-label">Total Students</div></div>
              <div className="admin-stat" style={{ borderColor: 'var(--secondary)' }}><div className="admin-stat-num" style={{ color: 'var(--secondary)' }}>280</div><div className="admin-stat-label">Teaching Staff</div></div>
              <div className="admin-stat" style={{ borderColor: 'var(--success)' }}><div className="admin-stat-num" style={{ color: 'var(--success)' }}>47</div><div className="admin-stat-label">Pending Admissions</div></div>
              <div className="admin-stat" style={{ borderColor: 'var(--accent)' }}><div className="admin-stat-num" style={{ color: 'var(--accent)' }}>98%</div><div className="admin-stat-label">Attendance Today</div></div>
            </div>
            <div className="cards-grid">
              <div className="card"><div className="card-title mb-2">📊 Class Strength</div>
                <table className="data-table">
                  <thead><tr><th>Class</th><th>Students</th><th>Status</th></tr></thead>
                  <tbody>
                    <tr><td>Class 10</td><td>420</td><td><span className="status-badge status-active">Full</span></td></tr>
                    <tr><td>Class 11</td><td>380</td><td><span className="status-badge status-active">Open</span></td></tr>
                    <tr><td>Class 12</td><td>362</td><td><span className="status-badge status-active">Full</span></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="card"><div className="card-title mb-2">📣 Recent Notices</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Winter Break Announced</div><div className="text-muted text-sm">Dec 1, 2026</div></div>
                  <div style={{ padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sports Day Schedule Released</div><div className="text-muted text-sm">Nov 28, 2026</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Management */}
          <div className="dash-section" id="adm-students">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🎓 Student Management</h2>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <input className="form-input" style={{ maxWidth: '280px' }} placeholder="🔍 Search students..." />
              <select className="form-select" style={{ maxWidth: '180px' }}><option>All Classes</option><option>Class 10</option><option>Class 11</option><option>Class 12</option></select>
              <button className="btn-submit btn-sm" onClick={() => showToast('Add student form ready for backend', '')}>+ Add Student</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Student Name</th><th>Class</th><th>Roll No.</th><th>Attendance</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td><strong>Arjun Sharma</strong></td><td>10A</td><td>VID2024042</td><td>94%</td><td><span className="status-badge status-active">Active</span></td><td><button className="btn-secondary btn-sm" onClick={() => showToast('Viewing Arjun Sharma profile', '')}>View</button></td></tr>
                <tr><td><strong>Preethi Nair</strong></td><td>10A</td><td>VID2024043</td><td>97%</td><td><span className="status-badge status-active">Active</span></td><td><button className="btn-secondary btn-sm">View</button></td></tr>
                <tr><td><strong>Rahul Gupta</strong></td><td>10A</td><td>VID2024044</td><td>78%</td><td><span className="status-badge status-pending">Review</span></td><td><button className="btn-secondary btn-sm">View</button></td></tr>
                <tr><td><strong>Sana Khan</strong></td><td>11A</td><td>VID2024045</td><td>99%</td><td><span className="status-badge status-active">Active</span></td><td><button className="btn-secondary btn-sm">View</button></td></tr>
                <tr><td><strong>Vikram Rao</strong></td><td>12B</td><td>VID2024046</td><td>88%</td><td><span className="status-badge status-active">Active</span></td><td><button className="btn-secondary btn-sm">View</button></td></tr>
              </tbody>
            </table>
          </div>

          {/* Teacher Management */}
          <div className="dash-section" id="adm-teachers">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👩‍🏫 Teacher Management</h2>
            <div style={{ marginBottom: '1rem' }}><button className="btn-submit btn-sm" onClick={() => showToast('Add teacher form ready for backend', '')}>+ Add Teacher</button></div>
            <table className="data-table">
              <thead><tr><th>Teacher Name</th><th>Department</th><th>Subject</th><th>Classes</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td><strong>Priya Mehta</strong></td><td>Science</td><td>Physics</td><td>10A, 10B, 11A, 12A</td><td><span className="status-badge status-active">Active</span></td></tr>
                <tr><td><strong>Anil Kumar</strong></td><td>Mathematics</td><td>Mathematics</td><td>10A, 10B, 11A</td><td><span className="status-badge status-active">Active</span></td></tr>
                <tr><td><strong>Sneha Rao</strong></td><td>Languages</td><td>English</td><td>9A, 9B, 10A, 10B</td><td><span className="status-badge status-active">Active</span></td></tr>
                <tr><td><strong>Ramesh Iyer</strong></td><td>Science</td><td>Chemistry</td><td>11A, 11B, 12A, 12B</td><td><span className="status-badge status-active">Active</span></td></tr>
                <tr><td><strong>Kavita Sharma</strong></td><td>Social Science</td><td>History</td><td>8A, 9A, 10A</td><td><span className="status-badge status-pending">On Leave</span></td></tr>
              </tbody>
            </table>
          </div>

          {/* Admissions */}
          <div className="dash-section" id="adm-admissions">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📋 Admission Applications</h2>
            <div className="admission-app-card"><div className="app-info"><div className="app-name">Rahul Verma</div><div className="app-meta">Applied for Class 9 · Dec 3, 2026 · parent@email.com</div></div><div className="app-actions"><button className="btn-submit btn-sm" onClick={() => showToast('Application Approved!', 'success')}>✓ Approve</button><button className="btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => showToast('Application rejected', '')}>✗ Reject</button></div></div>
            <div className="admission-app-card"><div className="app-info"><div className="app-name">Ananya Singh</div><div className="app-meta">Applied for Class 6 · Dec 2, 2026 · mom@gmail.com</div></div><div className="app-actions"><button className="btn-submit btn-sm" onClick={() => showToast('Application Approved!', 'success')}>✓ Approve</button><button className="btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => showToast('Application rejected', '')}>✗ Reject</button></div></div>
            <div className="admission-app-card"><div className="app-info"><div className="app-name">Mohammed Ali</div><div className="app-meta">Applied for Class 11 Science · Nov 30, 2026 · dad@email.com</div></div><div className="app-actions"><button className="btn-submit btn-sm" onClick={() => showToast('Application Approved!', 'success')}>✓ Approve</button><button className="btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => showToast('Application rejected', '')}>✗ Reject</button></div></div>
            <div className="admission-app-card"><div className="app-info"><div className="app-name">Priya Patel</div><div className="app-meta">Applied for Class 1 · Nov 28, 2026 · priyapatel@gmail.com</div></div><div className="app-actions"><button className="btn-submit btn-sm" onClick={() => showToast('Application Approved!', 'success')}>✓ Approve</button><button className="btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => showToast('Application rejected', '')}>✗ Reject</button></div></div>
          </div>

          {/* Notice Management */}
          <div className="dash-section" id="adm-notices">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📣 Notice Management</h2>
            <div className="card" style={{ maxWidth: '600px', marginBottom: '2rem' }}>
              <div className="form-group"><label className="form-label">Notice Title</label><input className="form-input" placeholder="e.g., Winter Break Announcement" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Target Audience</label><select className="form-select"><option>All</option><option>Students Only</option><option>Parents Only</option><option>Teachers Only</option></select></div>
                <div className="form-group"><label className="form-label">Category</label><select className="form-select"><option>General</option><option>Academic</option><option>Event</option><option>Urgent</option></select></div>
              </div>
              <div className="form-group"><label className="form-label">Notice Content</label><textarea className="form-textarea" placeholder="Write the notice content..."></textarea></div>
              <button className="btn-submit" onClick={() => showToast('Notice published to all users!', 'success')}>Publish Notice 📣</button>
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Recent Notices</h3>
            <div className="announcements-list">
              <div className="announcement-item"><span className="ann-badge badge-new">LIVE</span><div className="ann-content"><div className="ann-title">Winter Break: December 22 to January 5</div><div className="ann-meta">Published Dec 1, 2026 · All Users</div></div><button className="btn-secondary btn-sm" onClick={() => showToast('Notice deleted', '')}>Delete</button></div>
              <div className="announcement-item"><span className="ann-badge badge-event">LIVE</span><div className="ann-content"><div className="ann-title">Annual Sports Day — December 15</div><div className="ann-meta">Published Nov 28, 2026 · All Users</div></div><button className="btn-secondary btn-sm" onClick={() => showToast('Notice deleted', '')}>Delete</button></div>
            </div>
          </div>

          {/* Event Management */}
          <div className="dash-section" id="adm-events">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Event Management</h2>
            <div className="event-form-card mb-3">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Event Name</label><input className="form-input" placeholder="e.g., Annual Science Fair" /></div>
                <div className="form-group"><label className="form-label">Event Date</label><input className="form-input" type="date" /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" style={{ minHeight: '80px' }} placeholder="Event description..."></textarea></div>
              <button className="btn-submit" onClick={() => showToast('Event added to calendar!', 'success')}>Add Event 📅</button>
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Upcoming Events</h3>
            <div className="upcoming-event-chip"><span className="event-chip-date">Dec 14</span><span className="event-chip-name">Parent-Teacher Meeting</span><span className="event-chip-badge">PTM</span><button className="btn-secondary btn-sm" onClick={() => showToast('Event removed', '')}>Remove</button></div>
            <div className="upcoming-event-chip"><span className="event-chip-date">Dec 15</span><span className="event-chip-name">Annual Sports Day</span><span className="event-chip-badge">Sports</span><button className="btn-secondary btn-sm" onClick={() => showToast('Event removed', '')}>Remove</button></div>
            <div className="upcoming-event-chip"><span className="event-chip-date">Dec 18</span><span className="event-chip-name">Science Fair 2024</span><span className="event-chip-badge">Academic</span><button className="btn-secondary btn-sm" onClick={() => showToast('Event removed', '')}>Remove</button></div>
          </div>

          {/* Gallery Management */}
          <div className="dash-section" id="adm-gallery">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🖼️ Gallery Management</h2>
            <div className="form-group" style={{ maxWidth: '400px' }}><label className="form-label">Category</label><select className="form-select"><option>Campus</option><option>Sports</option><option>Cultural Events</option><option>Functions</option></select></div>
            <div className="gallery-upload-zone" onClick={() => showToast('Image upload ready for backend integration', '')}>
              <div className="upload-icon">🖼️</div>
              <div className="upload-text">Click to upload images</div>
              <div className="upload-hint">JPG, PNG · Max 5MB each · Multiple selection supported</div>
            </div>
            <div className="mt-3">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Gallery Items</h3>
              <div className="gallery-full-grid">
                <div className="gallery-full-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🏫</span></div><div className="gallery-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.5)' }}><button className="btn-secondary btn-sm" onClick={() => showToast('Image deleted', '')}>🗑 Delete</button></div></div>
                <div className="gallery-full-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>⚽</span></div><div className="gallery-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.5)' }}><button className="btn-secondary btn-sm" onClick={() => showToast('Image deleted', '')}>🗑 Delete</button></div></div>
                <div className="gallery-full-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🎭</span></div><div className="gallery-overlay" style={{ opacity: 1, background: 'rgba(0,0,0,0.5)' }}><button className="btn-secondary btn-sm" onClick={() => showToast('Image deleted', '')}>🗑 Delete</button></div></div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="dash-section" id="adm-settings">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>⚙️ System Settings</h2>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div className="form-section-title">School Information</div>
              <div className="form-group"><label className="form-label">School Name</label><input className="form-input" defaultValue="India Springs School of Excellence" /></div>
              <div className="form-group"><label className="form-label">Principal Name</label><input className="form-input" defaultValue="Dr. Rajan Iyer" /></div>
              <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" defaultValue="info@vidyalaya.edu.in" /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+91 80 1234 5678" /></div>
              <div className="form-section-title">Academic Settings</div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Academic Year</label><input className="form-input" defaultValue="2025–26" /></div>
                <div className="form-group"><label className="form-label">Current Term</label><select className="form-select"><option>Term 1</option><option defaultValue>Term 2</option></select></div>
              </div>
              <button className="btn-submit" onClick={() => showToast('Settings saved successfully!', 'success')}>Save Settings</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}