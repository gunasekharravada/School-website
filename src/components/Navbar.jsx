import './Navbar.css';
import {FaUser}from "react-icons/fa";

export default function Navbar({ navigate, setActiveNav }) {
  function toggleLoginDropdown() {
    document.getElementById('loginDropdown').classList.toggle('open');
  }

  function closeLoginDropdown() {
    document.getElementById('loginDropdown').classList.remove('open');
  }

  function handleNavLink(page, el) {
    navigate(page);
    setActiveNav(el);
  }

  function toggleMobileMenu() {
    const links = document.querySelector('.nav-links');
    if (links.style.display === 'flex') {
      links.style.display = '';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '68px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'white';
      links.style.padding = '1rem';
      links.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }
  }

  return (
    <nav className="navbar" id="main-navbar">
      <div className="nav-brand" onClick={() => navigate('home')}>
        <div className="logo-icon">🏫</div>
        Vidya<span className="accent">laya</span>
      </div>
      <ul className="nav-links">
        <li className="nav-link active" onClick={(e) => handleNavLink('home', e.currentTarget)}>Home</li>
        <li className="nav-link" onClick={(e) => handleNavLink('about', e.currentTarget)}>About</li>
        <li className="nav-link" onClick={() => navigate('academics')}>Academics</li>
        <li className="nav-link" onClick={(e) => handleNavLink('admission', e.currentTarget)}>Admissions</li>
        <li className="nav-link" onClick={(e) => handleNavLink('events', e.currentTarget)}>Events</li>
        <li className="nav-link" onClick={(e) => handleNavLink('gallery', e.currentTarget)}>Gallery</li>
        <li className="nav-link" onClick={(e) => handleNavLink('contact', e.currentTarget)}>Contact</li>
      </ul>
      <div className="nav-login-wrap" id="loginWrap">
        <button className="btn-login-main" onClick={toggleLoginDropdown}>
          <FaUser/> Login <span>▾</span>
        </button>
        <div className="login-dropdown" id="loginDropdown">
          <div className="login-dropdown-item" onClick={() => { navigate('student-login'); closeLoginDropdown(); }}>
            <div className="role-icon" style={{ background: '#eff6ff' }}>🎓</div> Student Login
          </div>
          <div className="login-dropdown-item" onClick={() => { navigate('teacher-login'); closeLoginDropdown(); }}>
            <div className="role-icon" style={{ background: '#f0fdf4' }}>👩‍🏫</div> Teacher Login
          </div>
          <div className="login-dropdown-item" onClick={() => { navigate('parent-login'); closeLoginDropdown(); }}>
            <div className="role-icon" style={{ background: '#fef3c7' }}>👨‍👩‍👧</div> Parent Login
          </div>
          <div className="login-dropdown-item" onClick={() => { navigate('admin-login'); closeLoginDropdown(); }}>
            <div className="role-icon" style={{ background: '#fef2f2' }}>⚙️</div> Admin Login
          </div>
        </div>
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
}
