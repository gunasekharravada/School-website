import { useState, useEffect } from 'react';
import '../components/Sidebar.css';
import './AdminDashboard.css';
import { auth, db } from '../firebase/firebaseconfig'; 
import { signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // Added onAuthStateChanged
import { collection, doc, setDoc, query, where, getDocs, getDoc, updateDoc } from 'firebase/firestore';

export default function AdminDashboard({ navigate, showToast }) {
  const [activeModal, setActiveModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Profile data states for loading/updating admin records
  // Initialized cleanly with empty strings instead of "Loading..." text strings
  const [adminProfile, setAdminProfile] = useState({
    fullName: '',
    contactNumber: ''
  });

  const [studentFormData, setStudentFormData] = useState({
    fullName: '', dob: '', gender: '', className: '', section: '',
    rollNo: '', studentGrade: '', previousSchool: '',
    parentName: '', relationship: 'Father', parentEmail: '', parentPhone: '', address: ''
  });

  const [teacherFormData, setTeacherFormData] = useState({
    teacherName: '', employeeId: '', dob: '', gender: '', subjects: '', assignedClasses: '', teacherEmail: '', teacherPhone: ''
  });

  // FIXED: Handles persistence on page reload by tracking active auth sessions dynamically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const adminDocRef = doc(db, 'admins', currentUser.uid);
          const docSnap = await getDoc(adminDocRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setAdminProfile({
              fullName: data.fullName || 'Administrator',
              contactNumber: data.contactNumber || ''
            });
          } else {
            // Fallback setup if manual firestore document hasn't been built yet
            setAdminProfile({
              fullName: 'Vidyalaya Admin',
              contactNumber: ''
            });
          }
        } catch (error) {
          console.error("Error fetching admin data on state change:", error);
        }
      } else {
        // No user logged in, kick out to home screen to protect routes safely
        navigate('home');
      }
    });

    // Cleanup subscription tracker on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
  };

  async function handleLogout() {
    try {
      await signOut(auth);
      showToast('Logged out successfully', 'success');
      navigate('home'); 
    } catch (error) {
      console.error("Logout Error: ", error.message);
      showToast('Failed to log out smoothly. Please try again.', 'danger');
    }
  }

  // Handle Admin Profile Updating
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsUpdatingProfile(true);
    try {
      const adminDocRef = doc(db, 'admins', currentUser.uid);
      const updatedFullName = adminProfile.fullName.trim();
      const updatedContactNumber = adminProfile.contactNumber.trim();

      await updateDoc(adminDocRef, {
        fullName: updatedFullName,
        contactNumber: updatedContactNumber
      });

      // Synchronize changes to local state immediately so sidebar & navbar refresh together
      setAdminProfile({
        fullName: updatedFullName,
        contactNumber: updatedContactNumber
      });

      showToast('Profile records updated successfully!', 'success');
    } catch (error) {
      console.error("Admin Profile Update Error: ", error.message);
      showToast('Failed to update details. Try checking database rules.', 'danger');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleStudentRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const studentsRef = collection(db, 'students');
      const duplicateQuery = query(
        studentsRef,
        where('academicInfo.rollNumber', '==', studentFormData.rollNo.trim())
      );
      
      const querySnapshot = await getDocs(duplicateQuery);
      
      if (!querySnapshot.empty) {
        showToast(`Registration failed: Roll Number "${studentFormData.rollNo}" already exists!`, 'danger');
        setIsSubmitting(false);
        return; 
      }

      const temporaryPassword = "Password123!"; 
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        studentFormData.parentEmail.trim(), 
        temporaryPassword
      );
      
      const uid = userCredential.user.uid;

      const studentPayload = {
        uid: uid,
        studentInfo: {
          fullName: studentFormData.fullName.trim(),
          dateOfBirth: studentFormData.dob,
          gender: studentFormData.gender,
          class: studentFormData.className,
        },
        academicInfo: {
          section: studentFormData.section.trim(),
          rollNumber: studentFormData.rollNo.trim(),
          grade: studentFormData.studentGrade.trim(),
          previousSchool: studentFormData.previousSchool || 'N/A'
        },
        contactInfo: {
          parentName: studentFormData.parentName.trim(),
          relationship: studentFormData.relationship,
          email: studentFormData.parentEmail.trim().toLowerCase(),
          phone: studentFormData.parentPhone.trim(),
          residentialAddress: studentFormData.address.trim()
        },
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'students', uid), studentPayload);

      showToast('Student registered and authenticated successfully!', 'success');
      setActiveModal(null);
      setStudentFormData({
        fullName: '', dob: '', gender: '', className: '', section: '',
        rollNo: '', studentGrade: '', previousSchool: '',
        parentName: '', relationship: 'Father', parentEmail: '', parentPhone: '', address: ''
      });

    } catch (error) {
      console.error("Student Registration Core Error: ", error.message);
      showToast(error.message, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const teachersRef = collection(db, 'teachers');
      const duplicateTeacherQuery = query(
        teachersRef,
        where('employeeId', '==', teacherFormData.employeeId.trim())
      );

      const querySnapshot = await getDocs(duplicateTeacherQuery);

      if (!querySnapshot.empty) {
        showToast(`Registration failed: Teacher with Employee ID "${teacherFormData.employeeId}" already exists!`, 'danger');
        setIsSubmitting(false);
        return; 
      }

      const temporaryPassword = "TeacherPassword123!"; 
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        teacherFormData.teacherEmail.trim(), 
        temporaryPassword
      );
      
      const uid = userCredential.user.uid;

      const teacherPayload = {
        uid: uid,
        employeeId: teacherFormData.employeeId.trim(),
        teacherName: teacherFormData.teacherName.trim(),
        dateOfBirth: teacherFormData.dob,
        gender: teacherFormData.gender,
        subjects: teacherFormData.subjects.split(',').map(s => s.trim()), 
        assignedClasses: teacherFormData.assignedClasses.split(',').map(c => c.trim()), 
        contactInfo: {
          email: teacherFormData.teacherEmail.trim().toLowerCase(),
          phone: teacherFormData.teacherPhone.trim()
        },
        status: 'Active',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'teachers', uid), teacherPayload);

      showToast('Teacher registered and authenticated successfully!', 'success');
      setActiveModal(null);
      setTeacherFormData({
        teacherName: '', employeeId: '', dob: '', gender: '', subjects: '', assignedClasses: '', teacherEmail: '', teacherPhone: ''
      });

    } catch (error) {
      console.error("Teacher Registration Core Error: ", error.message);
      showToast(error.message, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-admin-dashboard .dash-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.closest('.sidebar').querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
  }

  return (
    <div className="dashboard-page" id="page-admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="logo-icon">🏫</div>
            <div className="sidebar-brand-name">Vidyalaya</div>
          </div>
        </div>
        
        {/* Dynamic Sidebar - Listens to state updates real-time */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">⚙️</div>
          <div className="sidebar-user-name">{adminProfile.fullName || 'System Admin'}</div>
          <div className="sidebar-user-role">System Administrator</div>
        </div>
        
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
          
          <div className="sidebar-section-label">Account</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-settings', e.currentTarget)}><span className="icon">⚙️</span>Settings</div>
        </nav>
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
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>
              {adminProfile.fullName ? adminProfile.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </div>
        <div className="dashboard-content">

          {/* HOME SECTION */}
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

          {/* STUDENTS SECTION */}
          <div className="dash-section" id="adm-students">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🎓 Student Management</h2>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <input className="form-input" style={{ maxWidth: '280px' }} placeholder="🔍 Search students..." />
              <select className="form-select" style={{ maxWidth: '180px' }}><option>All Classes</option><option>Class 6</option><option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option></select>
              <button className="btn-submit btn-sm" onClick={() => setActiveModal('student')}>+ Add Student</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Student Name</th><th>Class</th><th>Roll No.</th><th>Attendance</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td><strong>Arjun Sharma</strong></td><td>10A</td><td>VID2024042</td><td>94%</td><td><span className="status-badge status-active">Active</span></td><td><button className="btn-secondary btn-sm" onClick={() => showToast('Viewing Arjun Sharma profile', '')}>View</button></td></tr>
                <tr><td><strong>Preethi Nair</strong></td><td>10A</td><td>VID2024043</td><td>97%</td><td><span className="status-badge status-active">Active</span></td><td><button className="btn-secondary btn-sm">View</button></td></tr>
                <tr><td><strong>Rahul Gupta</strong></td><td>10A</td><td>VID2024044</td><td>78%</td><td><span className="status-badge status-pending">Review</span></td><td><button className="btn-secondary btn-sm">View</button></td></tr>
              </tbody>
            </table>
          </div>

          {/* TEACHERS SECTION */}
          <div className="dash-section" id="adm-teachers">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👩‍🏫 Teacher Management</h2>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <input className="form-input" style={{ maxWidth: '280px' }} placeholder="🔍 Search teachers..." />
              <select className="form-select" style={{ maxWidth: '180px' }}>
                <option>All Subjects</option>
                <option>Science</option>
                <option>Mathematics</option>
                <option>Social Studies</option>
                <option>English</option>
              </select>
              <button className="btn-submit btn-sm" onClick={() => setActiveModal('teacher')}>+ Add Teacher</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Teacher Name</th><th>Employee ID</th><th>Subjects</th><th>Assigned Classes</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td><strong>Priya Mehta</strong></td><td>EMP2026081</td><td>Physics, Chemistry</td><td>10A, 10B, 11A, 12A</td><td><span className="status-badge status-active">Active</span></td></tr>
                <tr><td><strong>Anil Kumar</strong></td><td>EMP2026094</td><td>Mathematics</td><td>10A, 10B, 11A</td><td><span className="status-badge status-active">Active</span></td></tr>
              </tbody>
            </table>
          </div>

          {/* MY PROFILE SECTION - Email input removed cleanly */}
          <div className="dash-section" id="adm-profile">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>👤 My Profile Details</h2>
            <p className="text-muted mb-4" style={{ marginBottom: '1.5rem' }}>Manage your basic control panel contact records here.</p>
            
            <div className="card" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                  <label className="form-label">Admin Full Name</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    name="fullName" 
                    value={adminProfile.fullName} 
                    onChange={handleProfileChange} 
                    placeholder="Enter Admin Full Name"
                    required 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Contact Number (Phone)</label>
                  <input 
                    className="form-input" 
                    type="tel" 
                    name="contactNumber" 
                    value={adminProfile.contactNumber} 
                    onChange={handleProfileChange} 
                    placeholder="Enter Phone Number"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-submit" 
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Saving Records...' : 'Save Profile Details Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* SYSTEM SETTINGS FALLBACK SECTION */}
          <div className="dash-section" id="adm-settings">
            <h2>⚙️ System Settings</h2>
            <p>System configuration panels modules generic overview.</p>
          </div>

          {/* MODAL BLOCKS */}
          {activeModal === 'student' && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '2rem 0' }}>
              <div className="card" style={{ maxWidth: '750px', width: '90%', margin: 'auto', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem' }}>📝 Student Registration Form</h3>
                  <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>&times;</button>
                </div>
                <form onSubmit={handleStudentRegistration}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--primary)', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.3rem', marginBottom: '1rem', fontWeight: 700 }}>1. Student Personal Information</h4>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Student Full Name *</label>
                      <input className="form-input" type="text" name="fullName" value={studentFormData.fullName} onChange={handleStudentChange} required placeholder="John Doe" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Date of Birth *</label>
                        <input className="form-input" type="date" name="dob" value={studentFormData.dob} onChange={handleStudentChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender *</label>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                            <input type="radio" name="gender" value="Male" checked={studentFormData.gender === 'Male'} onChange={handleStudentChange} required /> Male
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                            <input type="radio" name="gender" value="Female" checked={studentFormData.gender === 'Female'} onChange={handleStudentChange} /> Female
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                            <input type="radio" name="gender" value="Other" checked={studentFormData.gender === 'Other'} onChange={handleStudentChange} /> Other
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--primary)', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.3rem', marginBottom: '1rem', fontWeight: 700 }}>2. Academic Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Applying for Class *</label>
                        <select className="form-select" name="className" value={studentFormData.className} onChange={handleStudentChange} required>
                          <option value="">-- Select Class --</option>
                          <option value="Class 6">Class 6th</option>
                          <option value="Class 7">Class 7th</option>
                          <option value="Class 8">Class 8th</option>
                          <option value="Class 9">Class 9th</option>
                          <option value="Class 10">Class 10th</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Section *</label>
                        <input className="form-input" type="text" name="section" value={studentFormData.section} onChange={handleStudentChange} required placeholder="e.g., A" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Roll Number (Unique Validation Key) *</label>
                        <input className="form-input" type="text" name="rollNo" value={studentFormData.rollNo} onChange={handleStudentChange} required placeholder="e.g., VID2026001" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Current Grade / Marks Level *</label>
                        <input className="form-input" type="text" name="studentGrade" value={studentFormData.studentGrade} onChange={handleStudentChange} required placeholder="e.g., A+" />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                      <label className="form-label">Previous School Name (If Any)</label>
                      <input className="form-input" type="text" name="previousSchool" value={studentFormData.previousSchool} onChange={handleStudentChange} placeholder="e.g., Greenvalley International School" />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--primary)', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.3rem', marginBottom: '1rem', fontWeight: 700 }}>3. Parent / Guardian Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Parent/Guardian Full Name *</label>
                        <input className="form-input" type="text" name="parentName" value={studentFormData.parentName} onChange={handleStudentChange} required placeholder="Parent Name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Relationship *</label>
                        <select className="form-select" name="relationship" value={studentFormData.relationship} onChange={handleStudentChange}>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div className="form-group">
                        <label className="parent-label">Parent Email Address (Login Username) *</label>
                        <input className="form-input" type="email" name="parentEmail" value={studentFormData.parentEmail} onChange={handleStudentChange} required placeholder="parent@example.com" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Parent Phone Number *</label>
                        <input className="form-input" type="tel" name="parentPhone" value={studentFormData.parentPhone} onChange={handleStudentChange} required placeholder="Contact Number" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Residential Address *</label>
                      <textarea className="form-input" name="address" rows="2" value={studentFormData.address} onChange={handleStudentChange} required placeholder="Complete home address..." style={{ resize: 'vertical' }}></textarea>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Verifying & Saving...' : 'Submit Registration 🚀'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeModal === 'teacher' && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '2rem 0' }}>
              <div className="card" style={{ maxWidth: '700px', width: '90%', margin: 'auto', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem' }}>📝 Add New Teacher Form</h3>
                  <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>&times;</button>
                </div>
                <form onSubmit={handleTeacherRegistration}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--secondary)', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.3rem', marginBottom: '1rem', fontWeight: 700 }}>Teacher Assignment Details</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Teacher Full Name *</label>
                        <input className="form-input" type="text" name="teacherName" value={teacherFormData.teacherName} onChange={handleTeacherChange} required placeholder="e.g., Priya Mehta" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Employee ID (Unique Validation Key) *</label>
                        <input className="form-input" type="text" name="employeeId" value={teacherFormData.employeeId} onChange={handleTeacherChange} required placeholder="e.g., EMP123" />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}