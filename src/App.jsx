import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './global.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AcademicsPage from './pages/AcademicsPage';
import EventsPage from './pages/EventsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdmissionPage from './pages/AdmissionPage';
import StudentLoginPage from './auth/StudentLoginPage';
import TeacherLoginPage from './auth/TeacherLoginPage';
import ParentLoginPage from './auth/ParentLoginPage';
import AdminLoginPage from './auth/AdminLoginPage';
import StudentDashboard from './dashboards/StudentDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const dashPages = ['student-dashboard', 'teacher-dashboard', 'parent-dashboard', 'admin-dashboard'];

function showToast(msg, type) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.className = 'toast show' + (type ? ` ${type}` : '');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
  }
}

// Updated navigation to save the active page to the browser's memory
function navigate(page) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentPage', page);
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dashboard-page').forEach(p => p.classList.remove('active'));

  const navbar = document.getElementById('main-navbar');
  if (dashPages.includes(page)) {
    const el = document.getElementById(`page-${page}`);
    if (el) el.classList.add('active');
    if (navbar) navbar.style.display = 'none';
  } else {
    const el = document.getElementById(`page-${page}`);
    if (el) el.classList.add('active');
    if (navbar) navbar.style.display = 'flex';
    window.scrollTo(0, 0);
  }

  if (page === 'admission') {
    const formSection = document.getElementById('admissionFormSection');
    const successSection = document.getElementById('admissionSuccess');
    if (formSection) formSection.classList.remove('hidden');
    if (successSection) successSection.classList.add('hidden');
  }
}

function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  el.classList.add('active');
}

if (typeof window !== 'undefined') {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('loginDropdown');
      if (dropdown) dropdown.classList.remove('open');
    }
  });
}

export default function App() {
  useEffect(() => {
    // 1. Check browser memory for the last visited page on reload
    const savedPage = localStorage.getItem('currentPage');
    
    if (savedPage) {
      navigate(savedPage); // Stay exactly on the current page
    } else {
      navigate('home'); // Default fallback if it's the absolute first visit
    }

    // 2. Safely handle Firebase sessions without forcefully changing the user's active page
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Session detected.");
        // Only run a dynamic redirect if no specific page was stored in memory
        if (!savedPage) {
          setTimeout(() => { navigate('admin-dashboard'); }, 100);
        }
      } else {
        console.log("No user logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div id="app">
      <Navbar navigate={navigate} setActiveNav={setActiveNav} />

      <HomePage navigate={navigate} showToast={showToast} />
      <AboutPage navigate={navigate} />
      <AcademicsPage navigate={navigate} />
      <EventsPage navigate={navigate} />
      <GalleryPage navigate={navigate} />
      <ContactPage navigate={navigate} showToast={showToast} />
      <AdmissionPage navigate={navigate} showToast={showToast} />

      <StudentLoginPage navigate={navigate} />
      <TeacherLoginPage navigate={navigate} />
      <ParentLoginPage navigate={navigate} />
      <AdminLoginPage navigate={navigate} />

      <StudentDashboard navigate={navigate} showToast={showToast} />
      <TeacherDashboard navigate={navigate} showToast={showToast} />
      <ParentDashboard navigate={navigate} showToast={showToast} />
      <AdminDashboard navigate={navigate} showToast={showToast} />

      <div className="toast" id="toast"></div>
    </div>
  );
}