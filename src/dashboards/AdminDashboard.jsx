import { useState, useEffect } from 'react';
import '../components/Sidebar.css';
import './AdminDashboard.css';
import { auth, db } from '../firebase/firebaseconfig';
import { signOut, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, query, where, getDocs, getDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

export default function AdminDashboard({ navigate, showToast }) {
  const [activeModal, setActiveModal] = useState(null);
  // 'student', 'teacher', 'notice', 'event', 'gallery', or null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Core application data states
  const [admissions, setAdmissions] = useState([]);
  const [acceptedAdmissions, setAcceptedAdmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  // Local UI collections state trackers
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  
  // Toggle tab filter within the Admissions Desk panel
  const [admissionsTab, setAdmissionsTab] = useState('pending');
  const [adminProfile, setAdminProfile] = useState({
    fullName: '', contactNumber: '', schoolName: ''
  });
  // Reconfigured System Academic Settings
  const [academicSettings, setAcademicSettings] = useState({
    academicYear: '2026',
    currentTerm: 'First Term'
  });
  // State trackers for detailed viewing and editing overlays
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  // Buffers for inline editing forms
  const [editStudentData, setEditStudentData] = useState({});
  const [editTeacherData, setEditTeacherData] = useState({});
  // Filter & Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherClassFilter, setTeacherClassFilter] = useState('');
  // Form Handlers State tracking variables
  const [studentFormData, setStudentFormData] = useState({
    fullName: '', dob: '', gender: '', className: '', section: '',
    rollNo: '', studentGrade: '', previousSchool: '',
    parentName: '', relationship: 'Father', parentEmail: '', parentPhone: '', address: ''
  });
  const [teacherFormData, setTeacherFormData] = useState({
    teacherName: '', employeeId: '', dob: '', gender: '', subjects: '', assignedClasses: '', teacherEmail: '', teacherPhone: ''
  });
  const [noticeFormData, setNoticeFormData] = useState({ title: '', target: 'All', content: '' });
  const [eventFormData, setEventFormData] = useState({ title: '', date: '', description: '' });
  // Custom configuration targets for the classes summary logic
  const [classRequirements, setClassRequirements] = useState({
    '6': 30, '7': 25, '8': 20, '9': 15, '10': 20
  });
  // Load All Core Management Tracking Logs & Firebase Initializers
  useEffect(() => {
    const loadDashboardData = async () => {
      const savedApps = JSON.parse(localStorage.getItem('schoolApplications')) || [];
      setAdmissions(savedApps);

      try {
        // Fetch Firestore Accepted Admissions
        const admissionsSnapshot = await getDocs(query(collection(db, 'admissions'), where('status', '==', 'Accepted')));
        const acceptedList = [];
        admissionsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          acceptedList.push({
            id: docSnap.id,
            applicationId: data.applicationId || docSnap.id,
            name: data.studentInfo?.fullName || 'N/A',
            class: data.studentInfo?.class || 'N/A',
            parentName: data.contactInfo?.parentName || 'N/A',
            phone: data.contactInfo?.phone || 'N/A',
            submissionDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Prior',
            status: 'Accepted',
            raw: data 
          });
        });
        setAcceptedAdmissions(acceptedList);

        // Fetch Student Management Profiles
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const studentsList = [];
        studentsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          studentsList.push({
            id: docSnap.id,
            name: data.studentInfo?.fullName || 'N/A',
            class: data.studentInfo?.class || 'N/A',
            section: data.academicInfo?.section || 'N/A',
            rollNo: data.academicInfo?.rollNumber || 'N/A',
            status: data.status || 'Active',
            raw: data
          });
        });
        setStudents(studentsList);

        // Fetch Teacher Management Profiles
        const teachersSnapshot = await getDocs(collection(db, 'teachers'));
        const teachersList = [];
        teachersSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          teachersList.push({
            id: docSnap.id,
            name: data.teacherName || 'N/A',
            employeeId: data.employeeId || 'N/A',
            subjects: Array.isArray(data.subjects) ? data.subjects.join(', ') : data.subjects || 'N/A',
            classes: Array.isArray(data.assignedClasses) ? data.assignedClasses.join(', ') : data.assignedClasses || 'N/A',
            status: data.status || 'Active',
            raw: data
          });
        });
        setTeachers(teachersList);

        // Fetch Notices, Events, and Settings
        const noticesSnap = await getDocs(collection(db, 'notices')).catch(() => ({forEach:()=>{}}));
        const noticesList = []; noticesSnap.forEach(d => noticesList.push({ id: d.id, ...d.data() }));
        setNotices(noticesList);

        const eventsSnap = await getDocs(collection(db, 'events')).catch(() => ({forEach:()=>{}}));
        const eventsList = []; eventsSnap.forEach(d => eventsList.push({ id: d.id, ...d.data() }));
        setEvents(eventsList);

        const gallerySnap = await getDocs(collection(db, 'gallery')).catch(() => ({forEach:()=>{}}));
        const galleryList = []; gallerySnap.forEach(d => galleryList.push({ id: d.id, ...d.data() }));
        setGalleryItems(galleryList);
        const settingsSnap = await getDoc(doc(db, 'settings', 'academic')).catch(() => null);
        if (settingsSnap && settingsSnap.exists()) {
          setAcademicSettings(settingsSnap.data());
        }
      } catch (err) {
        console.error("Dashboard engine query execution failure:", err);
      }
    };
    
    loadDashboardData();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docSnap = await getDoc(doc(db, 'admins', currentUser.uid));
          if (docSnap.exists()) {
            setAdminProfile({
              fullName: docSnap.data().fullName || 'Administrator',
              contactNumber: docSnap.data().contactNumber || '',
              schoolName: docSnap.data().schoolName || ''
            });
          }
        } catch (error) {
          console.error("Profile authorization check failure:", error);
        }
      } else {
        navigate('home');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Save Academic Settings & Profile Info Combined Update Logic
  const handleSaveAllConfigurations = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsUpdatingProfile(true);
    setIsSavingSettings(true);
    try {
      // Commit profile metrics safely
      await setDoc(doc(db, 'admins', auth.currentUser.uid), {
        fullName: adminProfile.fullName.trim(),
        contactNumber: adminProfile.contactNumber.trim(),
        schoolName: adminProfile.schoolName.trim()
      });
      // Commit academic frameworks configurations safely
      await setDoc(doc(db, 'settings', 'academic'), academicSettings, { merge: true });
      showToast('All profile configurations and academic settings successfully saved!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error persisting system configuration framework.', 'danger');
    } finally {
      setIsUpdatingProfile(false);
      setIsSavingSettings(false);
    }
  };
  const handleSaveAcademicSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'academic'), academicSettings, { merge: true });
      showToast('Academic configurations saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to update system settings.', 'danger');
    } finally {
      setIsSavingSettings(false);
    }
  };
  // Student Profile Modification Handler (Inline Edit Save)
  const handleSaveStudentEdit = async (e) => {
    e.preventDefault();
    try {
      const studentDocRef = doc(db, 'students', selectedStudent.id);
      const updatedPayload = {
        ...selectedStudent.raw,
        studentInfo: {
          ...selectedStudent.raw?.studentInfo,
          fullName: editStudentData.name,
          class: editStudentData.class
        },
        academicInfo: {
          ...selectedStudent.raw?.academicInfo,
          section: editStudentData.section,
          rollNumber: editStudentData.rollNo
        }
      };

      await updateDoc(studentDocRef, updatedPayload);
      // Update local state to trigger accurate re-rendering
      setStudents(prev => prev.map(st => st.id === selectedStudent.id ? {
        ...st,
        name: editStudentData.name,
        class: editStudentData.class,
        section: editStudentData.section,
        rollNo: editStudentData.rollNo,
        raw: updatedPayload
      } : st));
      setSelectedStudent(null);
      setIsEditingStudent(false);
      showToast('Student profile successfully updated!', 'success');
    } catch (err) {
      showToast('Error editing student profile.', 'danger');
    }
  };

  // Faculty Profile Modification Handler (Inline Edit Save)
  const handleSaveTeacherEdit = async (e) => {
    e.preventDefault();
    try {
      const teacherDocRef = doc(db, 'teachers', selectedTeacher.id);
      const updatedPayload = {
        ...selectedTeacher.raw,
        teacherName: editTeacherData.name,
        employeeId: editTeacherData.employeeId,
        subjects: editTeacherData.subjects.split(',').map(s => s.trim()),
        assignedClasses: editTeacherData.classes.split(',').map(c => c.trim())
      };
      await updateDoc(teacherDocRef, updatedPayload);

      // Update local state to trigger accurate re-rendering
      setTeachers(prev => prev.map(tc => tc.id === selectedTeacher.id ? {
        ...tc,
        name: editTeacherData.name,
        employeeId: editTeacherData.employeeId,
        subjects: editTeacherData.subjects,
        classes: editTeacherData.classes,
        raw: updatedPayload
      } : tc));
      setSelectedTeacher(null);
      setIsEditingTeacher(false);
      showToast('Faculty roster record updated successfully!', 'success');
    } catch (err) {
      showToast('Error editing teacher profile.', 'danger');
    }
  };

  // Handle Admission Approvals
  const handleAcceptAdmission = async (app) => {
    try {
      showToast(`Approving registration payload for ${app.name}...`, 'info');
      const admissionDocRef = doc(db, 'admissions', app.id);
      await updateDoc(admissionDocRef, { status: 'Accepted' }).catch(async (err) => {
        if (err.code === 'not-found') {
          await setDoc(admissionDocRef, {
            applicationId: app.id,
            studentInfo: { fullName: app.name, class: app.class },
            contactInfo: { parentName: app.parentName, phone: app.phone },
            status: 'Accepted',
            createdAt: new Date().toISOString()
          });
        } else throw err;
      });
      const updatedApps = admissions.filter(item => item.id !== app.id);
      localStorage.setItem('schoolApplications', JSON.stringify(updatedApps));
      setAdmissions(updatedApps);
      setAcceptedAdmissions(prev => [...prev, { id: app.id, applicationId: app.id, name: app.name, class: app.class, submissionDate: new Date().toLocaleDateString(), status: 'Accepted', raw: app }]);
      showToast(`Admission successfully approved!`, 'success');
    } catch (error) {
      showToast(error.message, 'danger');
    }
  };
  const handleRejectAdmission = (appId) => {
    const updatedApps = admissions.filter(item => item.id !== appId);
    localStorage.setItem('schoolApplications', JSON.stringify(updatedApps));
    setAdmissions(updatedApps);
    showToast(`Application deleted from workspace index.`, 'warning');
  };

  const handleDeleteAcceptedAdmission = async (id) => {
    if (!window.confirm("Delete this historical record permanently?")) return;
    try {
      await deleteDoc(doc(db, 'admissions', id));
      setAcceptedAdmissions(prev => prev.filter(item => item.id !== id));
      showToast(`Record purged successfully.`, 'success');
    } catch (error) {
      showToast("Purge execution error.", 'danger');
    }
  };
  // Student Direct Registration Submission Logic
  const handleStudentRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const querySnapshot = await getDocs(query(collection(db, 'students'), where('academicInfo.rollNumber', '==', studentFormData.rollNo.trim())));
      if (!querySnapshot.empty) {
        showToast(`Registration failed: Roll Number already exists!`, 'danger');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, studentFormData.parentEmail.trim(), "Password123!");
      const uid = userCredential.user.uid;
      const studentPayload = {
        uid,
        studentInfo: { fullName: studentFormData.fullName.trim(), dateOfBirth: studentFormData.dob, gender: studentFormData.gender, class: studentFormData.className },
        academicInfo: { section: studentFormData.section.trim(), rollNumber: studentFormData.rollNo.trim(), grade: studentFormData.studentGrade.trim(), previousSchool: studentFormData.previousSchool || 'N/A' },
        contactInfo: { parentName: studentFormData.parentName.trim(), relationship: studentFormData.relationship, email: studentFormData.parentEmail.trim().toLowerCase(), phone: studentFormData.parentPhone.trim(), residentialAddress: studentFormData.address.trim() },
        status: 'Active', createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'students', uid), studentPayload);
      setStudents(prev => [...prev, { id: uid, name: studentFormData.fullName.trim(), class: studentFormData.className, section: studentFormData.section.trim(), rollNo: studentFormData.rollNo.trim(), status: 'Active', raw: studentPayload }]);
      showToast('Student created successfully!', 'success');
      setActiveModal(null);
    } catch (error) {
      showToast(error.message, 'danger');
    } finally { 
      setIsSubmitting(false);
    }
  };
  // Teacher Direct Registration Submission Logic
  const handleTeacherRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const querySnapshot = await getDocs(query(collection(db, 'teachers'), where('employeeId', '==', teacherFormData.employeeId.trim())));
      if (!querySnapshot.empty) {
        showToast(`Registration failed: Employee ID already exists!`, 'danger');
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, teacherFormData.teacherEmail.trim(), "TeacherPassword123!");
      const uid = userCredential.user.uid;
      const teacherPayload = {
        uid, employeeId: teacherFormData.employeeId.trim(), teacherName: teacherFormData.teacherName.trim(), dateOfBirth: teacherFormData.dob, gender: teacherFormData.gender,
        subjects: teacherFormData.subjects.split(',').map(s => s.trim()), assignedClasses: teacherFormData.assignedClasses.split(',').map(c => c.trim()),
        contactInfo: { email: teacherFormData.teacherEmail.trim().toLowerCase(), phone: teacherFormData.teacherPhone.trim() },
        status: 'Active', createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'teachers', uid), teacherPayload);
      setTeachers(prev => [...prev, { id: uid, name: teacherFormData.teacherName.trim(), employeeId: teacherFormData.employeeId.trim(), subjects: teacherFormData.subjects, classes: teacherFormData.assignedClasses, status: 'Active', raw: teacherPayload }]);
      showToast('Teacher created successfully!', 'success');
      setActiveModal(null);
    } catch (error) {
      showToast(error.message, 'danger');
    } finally { 
      setIsSubmitting(false);
    }
  };
  const handleDeleteItem = async (collectionName, id, stateSetter) => {
    if(!window.confirm("Delete this entry permanently from the database?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      stateSetter(prev => prev.filter(item => item.id !== id));
      showToast('Item removed successfully.', 'success');
    } catch { showToast('Failed deletion process.', 'danger'); }
  };
  async function handleLogout() {
    try { await signOut(auth); showToast('Logged out.', 'success'); navigate('home');
    } catch { showToast('Error logging out.', 'danger'); }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsUpdatingProfile(true);
    try {
      await updateDoc(doc(db, 'admins', auth.currentUser.uid), { 
        fullName: adminProfile.fullName.trim(), 
        contactNumber: adminProfile.contactNumber.trim(),
        schoolName: adminProfile.schoolName.trim()
      });
      showToast('Profile saved!', 'success');
    } catch { showToast('Update error.', 'danger'); } finally { setIsUpdatingProfile(false); }
  };
  // Add Dynamic Content: Publish Notice Submission Handler
  const handlePublishNotice = async (e) => {
    e.preventDefault();
    if (!noticeFormData.title.trim() || !noticeFormData.content.trim()) {
      showToast('Please enter both title and content for notice creation.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: noticeFormData.title.trim(),
        target: noticeFormData.target,
        content: noticeFormData.content.trim(),
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'notices'), payload);
      setNotices(prev => [{ id: docRef.id, ...payload }, ...prev]);
      setNoticeFormData({ title: '', target: 'All', content: '' });
      showToast('New dynamic notice published successfully!', 'success');
    } catch (err) {
      showToast('Failed to deploy notice data object.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Add Dynamic Content: Event Creation Handler
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim() || !eventFormData.date) {
      showToast('Event name and picker date cannot be left blank.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: eventFormData.title.trim(),
        date: eventFormData.date,
        description: eventFormData.description.trim(),
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'events'), payload);
      setEvents(prev => [{ id: docRef.id, ...payload }, ...prev]);
      setEventFormData({ title: '', date: '', description: '' });
      showToast('New tracking calendar entry appended successfully!', 'success');
    } catch (err) {
      showToast('Failed to deploy calendar scheduling logs.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };
  function switchDashSection(id, el) {
    const sections = document.querySelectorAll('#page-admin-dashboard .dash-section');
    sections.forEach(s => s.classList.remove('active'));
    
    const targetSection = document.getElementById(id);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    if (el) {
      const sidebar = el.closest('.sidebar');
      if (sidebar) {
        sidebar.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      }
      el.classList.add('active');
    }
  }

  // Filtered lists computations
  const filteredStudents = students.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(studentSearch.toLowerCase()) || st.rollNo.includes(studentSearch);
    const matchesClass = studentClassFilter === '' ? true : String(st.class) === String(studentClassFilter);
    return matchesSearch && matchesClass;
  });
  const filteredTeachers = teachers.filter(tc => {
    const matchesSearch = tc.name.toLowerCase().includes(teacherSearch.toLowerCase()) || tc.employeeId.toLowerCase().includes(teacherSearch.toLowerCase());
    const matchesClass = teacherClassFilter === '' ? true : tc.classes.toLowerCase().includes(teacherClassFilter.toLowerCase());
    return matchesSearch && matchesClass;
  });
  // Dynamically calculate actual class allocations metric loops
  const classMatrixKeys = ['6', '7', '8', '9', '10'];
  return (
    <div className="dashboard-page" id="page-admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand"><div className="logo-icon">🏫</div><div className="sidebar-brand-name">{adminProfile.schoolName || 'Vidyalaya'}</div></div>
        </div>
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
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-admissions', e.currentTarget)}><span className="icon">📋</span>Admissions Desk</div>
          
          <div className="sidebar-section-label">Content & Interaction</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-notices', e.currentTarget)}><span className="icon">📢</span>Notice Board</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-events', e.currentTarget)}><span className="icon">📅</span>Event Management</div>
          
          <div className="sidebar-section-label">Account & Configuration</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('adm-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-item" onClick={handleLogout} style={{ color: 'rgba(255,100,100,0.8)' }}><span className="icon">🚪</span>Logout</div>
        </div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title">Welcome to {adminProfile.schoolName || 'Vidyalaya'} Admin Panel !</div>
          <div className="topbar-right">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {adminProfile.fullName ? adminProfile.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </div>

        <div className="dashboard-content">

          {/* HOME OVERVIEW */}
          <div className="dash-section active" id="adm-home">
            <div className="welcome-banner">
              <div className="welcome-title">{adminProfile.schoolName || 'Vidyalaya'} Control Matrix 🏫</div>
              <div className="welcome-subtitle">Operational Hub · Academic Year {academicSettings.academicYear} ({academicSettings.currentTerm})</div>
            </div>
            
            <div className="admin-stat-cards">
              <div className="admin-stat" onClick={() => document.querySelector('[onClick*="adm-students"]').click()}>
                <div className="admin-stat-num">{students.length}</div><div className="admin-stat-label">Total Students</div>
              </div>
              <div className="admin-stat" style={{ borderColor: 'var(--secondary)' }} onClick={() => document.querySelector('[onClick*="adm-teachers"]').click()}>
                <div className="admin-stat-num" style={{ color: 'var(--secondary)' }}>{teachers.length}</div><div className="admin-stat-label">Teaching Staff</div>
              </div>
              <div className="admin-stat" style={{ borderColor: '#dc2626' }} onClick={() => { document.querySelector('[onClick*="adm-admissions"]').click(); setAdmissionsTab('pending'); }}>
                <div className="admin-stat-num" style={{ color: '#dc2626' }}>{admissions.length}</div><div className="admin-stat-label">Pending Admissions</div>
              </div>
              <div className="admin-stat" style={{ borderColor: '#10b981' }} onClick={() => { document.querySelector('[onClick*="adm-admissions"]').click(); setAdmissionsTab('accepted'); }}>
                <div className="admin-stat-num" style={{ color: '#10b981' }}>{acceptedAdmissions.length}</div><div className="admin-stat-label">Accepted Admissions</div>
              </div>
            </div>

            {/* THREE BLOCK DASHBOARD LAYOUT BLOCK */}
            <div className="dashboard-blocks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
              
              {/* BLOCK 1: CLASS STRENGTH METRIC DISPLAYS */}
              <div className="card shadow-sm" style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>📊 Class Strength</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {classMatrixKeys.map(clsKey => {
                    const totalEnrolled = students.filter(st => String(st.class) === clsKey).length;
                    const requiredVacancy = classRequirements[clsKey] || 0;
                    const statusText = requiredVacancy === 0 ? 'Full' : 'Open';
                    const statusColor = requiredVacancy === 0 ? '#dc2626' : '#10b981';
                    return (
                      <div key={clsKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px' }}>
                        <strong>Class {clsKey}th</strong> 
                        <span>{totalEnrolled} / <small style={{ color: statusColor, fontWeight: 'bold' }}>{statusText}</small></span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BLOCK 2: RECENT NOTICE */}
              <div className="card shadow-sm" style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>📢 Recent Notice</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {notices.length > 0 ?
                    notices.slice(0, 3).map((n) => (
                      <div key={n.id} style={{ fontSize: '0.85rem', padding: '0.5rem', borderLeft: '3px solid #0ea5e9', background: '#f0f9ff' }}>
                        <div style={{ fontWeight: 'bold' }}>{n.title}</div>
                        <div style={{ color: '#4b5563', fontSize: '0.8rem', marginTop: '2px' }}>{n.content}</div>
                        <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>Target: {n.target || 'All'}</div>
                      </div>
                    )) : (
                      <div style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No active notices issued.</div>
                    )}
                </div>
              </div>

              {/* BLOCK 3: ACTIVE EVENTS */}
              <div className="card shadow-sm" style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>📅 Active Events</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {events.length > 0 ?
                    events.slice(0, 3).map((ev) => (
                      <div key={ev.id} style={{ fontSize: '0.85rem', padding: '0.5rem', borderLeft: '3px solid #10b981', background: '#f0fdf4' }}>
                        <div style={{ fontWeight: 'bold' }}>{ev.title}</div>
                        {ev.description && <div style={{ color: '#4b5563', fontSize: '0.8rem' }}>{ev.description}</div>}
                        <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '2px' }}>Date: {ev.date}</div>
                      </div>
                    )) : (
                      <div style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No live calendar events planned.</div>
                    )}
                </div>
              </div>

            </div>
          </div>

          {/* ADMISSIONS DESK */}
          <div className="dash-section" id="adm-admissions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
              <h2>📋 Online Admissions Desk</h2>
              <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '0.4rem', borderRadius: '8px' }}>
                <button onClick={() => setAdmissionsTab('pending')} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: admissionsTab === 'pending' ? '#dc2626' : 'transparent', color: admissionsTab === 'pending' ? 'white' : '#4b5563' }}>Pending ({admissions.length})</button>
                <button onClick={() => setAdmissionsTab('accepted')} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: admissionsTab === 'accepted' ? '#10b981' : 'transparent', color: admissionsTab === 'accepted' ? 'white' : '#4b5563' }}>Accepted ({acceptedAdmissions.length})</button>
              </div>
            </div>
            {admissionsTab === 'pending' ?
              (
                admissions.length === 0 ? <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>No pending records.</div> : (
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Class</th><th>Parent Name</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
                    <tbody>
                      {admissions.map(app => (
                        <tr key={app.id}>
                          <td onClick={() => setSelectedAdmission(app)} style={{ cursor: 'pointer', color: 'var(--primary)' }}><code>{app.id}</code></td>
                          <td onClick={() => setSelectedAdmission(app)} style={{ cursor: 'pointer' }}><strong>{app.name}</strong></td>
                          <td>{app.class}</td>
                          <td>{app.parentName}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                              <button className="btn-submit btn-sm" style={{ background: '#10b981', color: 'white', margin: 0, minWidth: '70px' }} onClick={(e) => { e.stopPropagation(); handleAcceptAdmission(app); }}>Accept</button>
                              <button className="btn-secondary btn-sm" style={{ background: '#dc2626', color: 'white', margin: 0, minWidth: '70px' }} onClick={(e) => { e.stopPropagation(); handleRejectAdmission(app.id); }}>Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : (
                acceptedAdmissions.length === 0 ? <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>No processed records.</div> : (
                  <table className="data-table">
                    <thead><tr><th>Application ID</th><th>Name</th><th>Class</th><th>Approved On</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
                    <tbody>
                      {acceptedAdmissions.map(app => (
                        <tr key={app.id}>
                          <td onClick={() => setSelectedAdmission(app)} style={{ cursor: 'pointer', color: 'var(--primary)' }}><code>{app.applicationId}</code></td>
                          <td onClick={() => setSelectedAdmission(app)} style={{ cursor: 'pointer' }}><strong>{app.name}</strong></td>
                          <td>{app.class}</td>
                          <td>{app.submissionDate}</td>
                          <td style={{ textAlign: 'center' }}><button className="btn-secondary btn-sm" style={{ background: '#dc2626', color: 'white', margin: 0 }} onClick={(e) => { e.stopPropagation(); handleDeleteAcceptedAdmission(app.id); }}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
          </div>

          {/* STUDENT MANAGEMENT */}
          <div className="dash-section" id="adm-students">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2>🎓 Student Profiles</h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input className="form-input" style={{ width: '200px', margin: 0 }} type="text" placeholder="🔍 Search student name/roll..." value={studentSearch} onChange={e => setStudentSearch(e.target.value)} />
                <select className="form-select" style={{ width: '130px', margin: 0 }} value={studentClassFilter} onChange={e => setStudentClassFilter(e.target.value)}>
                  <option value="">All Classes</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
                <button className="btn-submit btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => setActiveModal('student')}>+ Register Student</button>
              </div>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Class/Sec</th><th>Roll No</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
              <tbody>
                {filteredStudents.map(st => (
                  <tr key={st.id} onClick={() => { setSelectedStudent(st); setEditStudentData({ name: st.name, class: st.class, section: st.section, rollNo: st.rollNo }); }} style={{ cursor: 'pointer' }}>
                    <td><strong>{st.name}</strong></td>
                    <td>Class {st.class} ({st.section})</td>
                    <td>{st.rollNo}</td>
                    <td><span className="status-badge status-active">{st.status}</span></td>
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button className="btn-submit btn-sm" style={{ background: '#0ea5e9', color: 'white', margin: 0 }} onClick={() => { setSelectedStudent(st); setEditStudentData({ name: st.name, class: st.class, section: st.section, rollNo: st.rollNo }); setIsEditingStudent(false); }}>View</button>
                        <button className="btn-submit btn-sm" style={{ background: '#f59e0b', color: 'white', margin: 0 }} onClick={() => { setSelectedStudent(st); setEditStudentData({ name: st.name, class: st.class, section: st.section, rollNo: st.rollNo }); setIsEditingStudent(true); }}>Edit</button>
                        <button className="btn-secondary btn-sm" style={{ background: '#dc2626', color: 'white', margin: 0 }} onClick={() => handleDeleteItem('students', st.id, setStudents)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TEACHER MANAGEMENT */}
          <div className="dash-section" id="adm-teachers">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2>👩‍🏫 Faculty Assignment Roster</h2>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input className="form-input" style={{ width: '200px', margin: 0 }} type="text" placeholder="🔍 Search faculty/ID..." value={teacherSearch} onChange={e => setTeacherSearch(e.target.value)} />
                <input className="form-input" style={{ width: '130px', margin: 0 }} type="text" placeholder="Class Filter..." value={teacherClassFilter} onChange={e => setTeacherClassFilter(e.target.value)} />
                <button className="btn-submit btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => setActiveModal('teacher')}>+ Assign Faculty</button>
              </div>
            </div>
            <table className="data-table">
              <thead><tr><th>Faculty Name</th><th>Employee ID</th><th>Subjects Expertise</th><th>Portfolios</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th></tr></thead>
              <tbody>
                {filteredTeachers.map(tc => (
                  <tr key={tc.id} onClick={() => { setSelectedTeacher(tc); setEditTeacherData({ name: tc.name, employeeId: tc.employeeId, subjects: tc.subjects, classes: tc.classes }); }} style={{ cursor: 'pointer' }}>
                    <td><strong>{tc.name}</strong></td>
                    <td><code>{tc.employeeId}</code></td>
                    <td>{tc.subjects}</td>
                    <td>{tc.classes}</td>
                    <td><span className="status-badge status-active">{tc.status}</span></td>
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button className="btn-submit btn-sm" style={{ background: '#0ea5e9', color: 'white', margin: 0 }} onClick={() => { setSelectedTeacher(tc); setEditTeacherData({ name: tc.name, employeeId: tc.employeeId, subjects: tc.subjects, classes: tc.classes }); setIsEditingTeacher(false); }}>View</button>
                        <button className="btn-submit btn-sm" style={{ background: '#f59e0b', color: 'white', margin: 0 }} onClick={() => { setSelectedTeacher(tc); setEditTeacherData({ name: tc.name, employeeId: tc.employeeId, subjects: tc.subjects, classes: tc.classes }); setIsEditingTeacher(true); }}>Edit</button>
                        <button className="btn-secondary btn-sm" style={{ background: '#dc2626', color: 'white', margin: 0 }} onClick={() => handleDeleteItem('teachers', tc.id, setTeachers)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* NOTICE BOARD SECTION */}
          <div className="dash-section" id="adm-notices">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📢 Notice Management</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
              <div className="card shadow-sm">
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Deploy Public Board Notice</h3>
                <form onSubmit={handlePublishNotice}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Notice Header Title</label>
                    <input className="form-input" type="text" placeholder="e.g., Final Semester Examinations Scheduling" value={noticeFormData.title} onChange={e => setNoticeFormData({ ...noticeFormData, title: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Target Audience Scope</label>
                    <select className="form-select" value={noticeFormData.target} onChange={e => setNoticeFormData({ ...noticeFormData, target: e.target.value })}>
                      <option value="All">All Audience Matrices</option>
                      <option value="Students">Enrolled Student Profiles</option>
                      <option value="Teachers">Faculty Assignment Roster</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Notice Body Description</label>
                    <textarea className="form-input" rows="4" style={{ height: 'auto', resize: 'vertical' }} placeholder="Provide detailed announcement log text content details..." value={noticeFormData.content} onChange={e => setNoticeFormData({ ...noticeFormData, content: e.target.value })} required></textarea>
                  </div>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>Publish Notice Object</button>
                </form>
              </div>
              <div className="card shadow-sm">
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Live Bulletin Stream</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {notices.length > 0 ?
                    notices.map(n => (
                      <div key={n.id} style={{ padding: '1rem', background: '#f8fafc', borderLeft: '4px solid #0ea5e9', borderRadius: '4px', position: 'relative' }}>
                        <button onClick={() => handleDeleteItem('notices', n.id, setNotices)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{n.title}</h4>
                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#4b5563' }}>{n.content}</p>
                        <small style={{ color: '#6b7280', fontWeight: 'bold' }}>Target Group Scope: {n.target || 'All'}</small>
                      </div>
                    )) : <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No bulletins published to stream indexes.</div>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* EVENT MANAGEMENT SECTION */}
          <div className="dash-section" id="adm-events">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Event Calendar Workspace</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
              <div className="card shadow-sm">
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Schedule New Institutional Calendar Event</h3>
                <form onSubmit={handleAddEvent}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Event Heading Identifier</label>
                    <input className="form-input" type="text" placeholder="e.g., Annual Sports Meet Day 2026" value={eventFormData.title} onChange={e => setEventFormData({ ...eventFormData, title: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Scheduled Target Date</label>
                    <input className="form-input" type="date" value={eventFormData.date} onChange={e => setEventFormData({ ...eventFormData, date: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Event Description Context</label>
                    <textarea className="form-input" rows="3" style={{ height: 'auto', resize: 'vertical' }} placeholder="Specify itinerary details or venue briefs..." value={eventFormData.description} onChange={e => setEventFormData({ ...eventFormData, description: e.target.value })}></textarea>
                  </div>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>Add Event Framework</button>
                </form>
              </div>
              <div className="card shadow-sm">
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Upcoming Events</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {events.length > 0 ?
                    events.map(ev => (
                      <div key={ev.id} style={{ padding: '1rem', background: '#f8fafc', borderLeft: '4px solid #10b981', borderRadius: '4px', position: 'relative' }}>
                        <button onClick={() => handleDeleteItem('events', ev.id, setEvents)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{ev.title}</h4>
                        {ev.description && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#4b5563' }}>{ev.description}</p>}
                        <small style={{ color: '#6b7280', fontWeight: 'bold' }}>Scheduled execution: {ev.date}</small>
                      </div>
                    )) : <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No events booked into calendar loops.</div>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* ADMIN PROFILE & SETTINGS SECTION */}
          <div className="dash-section" id="adm-profile">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 Admin Matrix & Profile Architecture</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
              <div className="card shadow-sm">
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Personal Identity Configurations</h3>
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Full Name Signature</label>
                    <input className="form-input" type="text" value={adminProfile.fullName} onChange={e => setAdminProfile({ ...adminProfile, fullName: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Contact Mobile Link</label>
                    <input className="form-input" type="text" value={adminProfile.contactNumber} onChange={e => setAdminProfile({ ...adminProfile, contactNumber: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">School Brand Name</label>
                    <input className="form-input" type="text" value={adminProfile.schoolName} onChange={e => setAdminProfile({ ...adminProfile, schoolName: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-submit" disabled={isUpdatingProfile}>{isUpdatingProfile ? 'Saving profile...' : 'Commit Identity Changes'}</button>
                </form>
              </div>
              <div className="card shadow-sm">
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Academic Track Frameworks</h3>
                <form onSubmit={handleSaveAllConfigurations}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Academic Year Index</label>
                    <input className="form-input" type="text" placeholder="e.g., 2026" value={academicSettings.academicYear} onChange={e => setAcademicSettings({ ...academicSettings, academicYear: e.target.value })} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Current Term</label>
                    <input className="form-input" type="text" placeholder="e.g., First Term" value={academicSettings.currentTerm} onChange={e => setAcademicSettings({ ...academicSettings, currentTerm: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-submit" disabled={isUpdatingProfile || isSavingSettings}>
                    {isUpdatingProfile ? 'Saving Matrix Profiles...' : 'Save and Configure Changes'}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* OVERLAY DETAILS & INLINE EDIT MODALS */}
      {selectedStudent && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3>{isEditingStudent ? '📝 Edit Student Profile' : '📄 Student Database Document'}</h3>
            <hr />
            {isEditingStudent ? (
              <form onSubmit={handleSaveStudentEdit}>
                <div className="form-group mb-2"><label className="form-label">Full Name</label><input className="form-input" value={editStudentData.name} onChange={e => setEditStudentData({...editStudentData, name: e.target.value})} required /></div>
                <div className="form-group mb-2"><label className="form-label">Class</label><input className="form-input" value={editStudentData.class} onChange={e => setEditStudentData({...editStudentData, class: e.target.value})} required /></div>
                <div className="form-group mb-2"><label className="form-label">Section</label><input className="form-input" value={editStudentData.section} onChange={e => setEditStudentData({...editStudentData, section: e.target.value})} required /></div>
                <div className="form-group mb-2"><label className="form-label">Roll Number</label><input className="form-input" value={editStudentData.rollNo} onChange={e => setEditStudentData({...editStudentData, rollNo: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsEditingStudent(false)}>Back to View</button>
                  <button type="submit" className="btn-submit" style={{ margin: 0 }}>Save Profile Changes</button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Full Name:</strong> {selectedStudent.name}</p>
                <p><strong>Class Portfolio:</strong> Class {selectedStudent.class} ({selectedStudent.section})</p>
                <p><strong>Roll Identifier:</strong> {selectedStudent.rollNo}</p>
                <p><strong>System Status:</strong> {selectedStudent.status}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn-submit" style={{ margin: 0, background: '#f59e0b' }} onClick={() => setIsEditingStudent(true)}>Edit Mode</button>
                  <button className="btn-secondary" onClick={() => setSelectedStudent(null)}>Close View</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedTeacher && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h3>{isEditingTeacher ? '📝 Edit Teacher Allocation' : '📄 Faculty Database Document'}</h3>
            <hr />
            {isEditingTeacher ? (
              <form onSubmit={handleSaveTeacherEdit}>
                <div className="form-group mb-2"><label className="form-label">Faculty Full Name</label><input className="form-input" value={editTeacherData.name} onChange={e => setEditTeacherData({...editTeacherData, name: e.target.value})} required /></div>
                <div className="form-group mb-2"><label className="form-label">Employee Code ID</label><input className="form-input" value={editTeacherData.employeeId} onChange={e => setEditTeacherData({...editTeacherData, employeeId: e.target.value})} required /></div>
                <div className="form-group mb-2"><label className="form-label">Expertise Subjects (comma separated)</label><input className="form-input" value={editTeacherData.subjects} onChange={e => setEditTeacherData({...editTeacherData, subjects: e.target.value})} required /></div>
                <div className="form-group mb-2"><label className="form-label">Assigned Classes (comma separated)</label><input className="form-input" value={editTeacherData.classes} onChange={e => setEditTeacherData({...editTeacherData, classes: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsEditingTeacher(false)}>Back to View</button>
                  <button type="submit" className="btn-submit" style={{ margin: 0 }}>Save Roster Changes</button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Employee ID:</strong> {selectedTeacher.employeeId}</p>
                <p><strong>Teacher Name:</strong> {selectedTeacher.name}</p>
                <p><strong>Expertise Areas:</strong> {selectedTeacher.subjects}</p>
                <p><strong>Class Portfolios:</strong> {selectedTeacher.classes}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn-submit" style={{ margin: 0, background: '#f59e0b' }} onClick={() => setIsEditingTeacher(true)}>Edit Mode</button>
                  <button className="btn-secondary" onClick={() => setSelectedTeacher(null)}>Close View</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedAdmission && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem' }}>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3>📄 Comprehensive Admission Filing Logs</h3>
            <hr />
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <h4>Student Identity Metrics</h4>
              <p><strong>Full Name:</strong> {selectedAdmission.name}</p>
              <p><strong>Target Grade Class:</strong> {selectedAdmission.class}</p>
              <p><strong>Filing Date Index:</strong> {selectedAdmission.submissionDate}</p>
              <p><strong>Current Filing Status:</strong> <span className={`status-badge ${selectedAdmission.status === 'Accepted' ? 'status-active' : 'status-pending'}`}>{selectedAdmission.status}</span></p>
              
              {selectedAdmission.raw?.studentInfo && (
                <>
                  <p><strong>Date of Birth:</strong> {selectedAdmission.raw.studentInfo.dateOfBirth || 'N/A'}</p>
                  <p><strong>Gender Status:</strong> {selectedAdmission.raw.studentInfo.gender || 'N/A'}</p>
                  <p><strong>Previous Institution:</strong> {selectedAdmission.raw.academicInfo?.previousSchool || 'N/A'}</p>
                </>
              )}
              
              <h4 style={{ marginTop: '1rem' }}>Guardian Liaison Metrics</h4>
              <p><strong>Primary Guardian Name:</strong> {selectedAdmission.parentName}</p>
              <p><strong>Contact Liaison Phone:</strong> {selectedAdmission.phone}</p>
              {selectedAdmission.raw?.contactInfo?.email && <p><strong>Liaison Email Vector:</strong> {selectedAdmission.raw.contactInfo.email}</p>}
              {selectedAdmission.raw?.contactInfo?.residentialAddress && <p><strong>Residential Address Stack:</strong> {selectedAdmission.raw.contactInfo.residentialAddress}</p>}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              {selectedAdmission.status !== 'Accepted' && (
                <>
                  <button className="btn-submit" style={{ margin: 0, background: '#10b981' }} onClick={() => { handleAcceptAdmission(selectedAdmission); setSelectedAdmission(null); }}>Approve Entrance</button>
                  <button className="btn-secondary" style={{ background: '#dc2626', color: 'white' }} onClick={() => { handleRejectAdmission(selectedAdmission.id); setSelectedAdmission(null); }}>Reject Application</button>
                </>
              )}
              <button className="btn-secondary" onClick={() => setSelectedAdmission(null)}>Dismiss Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* Student Management Form Modal */}
      {activeModal === 'student' && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="modal-title" style={{ fontWeight: 800, marginBottom: '1rem' }}>Register New Student Profile</h3>
            <form onSubmit={handleStudentRegistration}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Student Full Name</label>
                  <input className="form-input" type="text" placeholder="Full Name" value={studentFormData.fullName} onChange={e => setStudentFormData({...studentFormData, fullName: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Date of Birth</label>
                  <input className="form-input" type="date" value={studentFormData.dob} onChange={e => setStudentFormData({...studentFormData, dob: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Gender</label>
                  <select className="form-select" value={studentFormData.gender} onChange={e => setStudentFormData({...studentFormData, gender: e.target.value})} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Class Name</label>
                  <input className="form-input" type="text" placeholder="e.g., 6, 7, 8" value={studentFormData.className} onChange={e => setStudentFormData({...studentFormData, className: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Section Name</label>
                  <input className="form-input" type="text" placeholder="e.g., A, B" value={studentFormData.section} onChange={e => setStudentFormData({...studentFormData, section: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Roll Number</label>
                  <input className="form-input" type="text" placeholder="Roll Number" value={studentFormData.rollNo} onChange={e => setStudentFormData({...studentFormData, rollNo: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Student Grade Level</label>
                  <input className="form-input" type="text" placeholder="e.g., A+, B" value={studentFormData.studentGrade} onChange={e => setStudentFormData({...studentFormData, studentGrade: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Previous Attended School</label>
                  <input className="form-input" type="text" placeholder="Previous School" value={studentFormData.previousSchool} onChange={e => setStudentFormData({...studentFormData, previousSchool: e.target.value})} />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Parent or Guardian Name</label>
                  <input className="form-input" type="text" placeholder="Parent Name" value={studentFormData.parentName} onChange={e => setStudentFormData({...studentFormData, parentName: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Relationship with Student</label>
                  <select className="form-select" value={studentFormData.relationship} onChange={e => setStudentFormData({...studentFormData, relationship: e.target.value})} required>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Parent Login Email</label>
                  <input className="form-input" type="email" placeholder="Parent Email" value={studentFormData.parentEmail} onChange={e => setStudentFormData({...studentFormData, parentEmail: e.target.value})} required />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Parent Phone Number</label>
                  <input className="form-input" type="tel" placeholder="Parent Phone" value={studentFormData.parentPhone} onChange={e => setStudentFormData({...studentFormData, parentPhone: e.target.value})} required />
                </div>
              </div>
              <div className="form-group mb-2" style={{ width: '100%' }}>
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Residential Address</label>
                <textarea className="form-input" placeholder="Residential Address" value={studentFormData.address} onChange={e => setStudentFormData({...studentFormData, address: e.target.value})} required style={{ height: '60px' }}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" style={{ background: '#ccc', margin: 0 }} onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-submit" style={{ margin: 0 }} disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Management Form Modal */}
      {activeModal === 'teacher' && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="modal-title" style={{ fontWeight: 800, marginBottom: '1rem' }}>Assign Faculty Member</h3>
            <form onSubmit={handleTeacherRegistration}>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Teacher Full Name</label>
                <input className="form-input" type="text" placeholder="Teacher Full Name" value={teacherFormData.teacherName} onChange={e => setTeacherFormData({...teacherFormData, teacherName: e.target.value})} required />
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Employee ID</label>
                <input className="form-input" type="text" placeholder="Employee ID" value={teacherFormData.employeeId} onChange={e => setTeacherFormData({...teacherFormData, employeeId: e.target.value})} required />
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Date of Birth</label>
                <input className="form-input" type="date" value={teacherFormData.dob} onChange={e => setTeacherFormData({...teacherFormData, dob: e.target.value})} required />
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Gender</label>
                <select className="form-select" value={teacherFormData.gender} onChange={e => setTeacherFormData({...teacherFormData, gender: e.target.value})} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Subjects (comma separated)</label>
                <input className="form-input" type="text" placeholder="Subjects (comma separated)" value={teacherFormData.subjects} onChange={e => setTeacherFormData({...teacherFormData, subjects: e.target.value})} required />
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Assigned Classes (comma separated)</label>
                <input className="form-input" type="text" placeholder="Assigned Classes (comma separated)" value={teacherFormData.assignedClasses} onChange={e => setTeacherFormData({...teacherFormData, assignedClasses: e.target.value})} required />
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Teacher Login Email</label>
                <input className="form-input" type="email" placeholder="Teacher Login Email" value={teacherFormData.teacherEmail} onChange={e => setTeacherFormData({...teacherFormData, teacherEmail: e.target.value})} required />
              </div>
              <div className="form-group mb-2">
                <label className="form-label" style={{ display: 'block', fontWeight: '600', marginBottom: '0.25rem' }}>Teacher Phone Number</label>
                <input className="form-input" type="tel" placeholder="Teacher Phone Number" value={teacherFormData.teacherPhone} onChange={e => setTeacherFormData({...teacherFormData, teacherPhone: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" style={{ background: '#ccc', margin: 0 }} onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-submit" style={{ margin: 0 }} disabled={isSubmitting}>{isSubmitting ? 'Assigning...' : 'Assign Faculty'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}