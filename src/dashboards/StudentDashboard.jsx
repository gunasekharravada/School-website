import { useState } from 'react';
import { getAuth, updatePassword } from 'firebase/auth'; // Ensure Firebase is initialized in your project
import '../components/Sidebar.css';
import './StudentDashboard.css';

const questions = [
  { q: "What is the value of x in the equation 2x + 5 = 15?", opts: ["x = 5", "x = 10", "x = 4", "x = 7"], ans: "A" },
  { q: "What is the square root of 144?", opts: ["10", "11", "12", "14"], ans: "C" },
  { q: "If a triangle has angles 60° and 80°, what is the third angle?", opts: ["30°", "40°", "50°", "60°"], ans: "B" },
  { q: "What is 15% of 200?", opts: ["25", "30", "35", "40"], ans: "B" },
  { q: "Which of these is a prime number?", opts: ["15", "21", "37", "49"], ans: "C" },
  { q: "Simplify: (a+b)² = ?", opts: ["a²+b²", "a²+2ab+b²", "a²-b²", "2a+2b"], ans: "B" },
  { q: "What is the perimeter of a rectangle with length 8 and width 5?", opts: ["13", "26", "40", "80"], ans: "B" },
  { q: "If f(x) = 2x+1, what is f(3)?", opts: ["5", "6", "7", "8"], ans: "C" },
  { q: "What is the HCF of 24 and 36?", opts: ["6", "8", "12", "18"], ans: "C" },
  { q: "What is 2³ × 2² ?", opts: ["10", "16", "32", "64"], ans: "C" }
];

let currentQ = 0;
let score = 0;
let selectedOpt = null;
let chatCount = 0;

const chatResponses = [
  "Great question! Let me help you with that topic.",
  "In Physics, this is explained by Newton's laws of motion. Force equals mass times acceleration (F = ma).",
  "For Mathematics, remember to always check your working and verify your answer by substituting back.",
  "The upcoming exam will cover chapters 5–9. Focus on formulas and practice previous year papers.",
  "Your next exam is on December 20th. You have plenty of time to prepare well!",
  "I recommend solving at least 10 problems per subject every day for consistent improvement.",
  "The school library is open until 4 PM. Great place to study with minimal distractions!"
];

export default function StudentDashboard({ navigate, showToast }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Visibility toggle states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function switchDashSection(id, el) {
    document.querySelectorAll('#page-student-dashboard .dash-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.closest('.sidebar').querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
  }

  function switchSubject(el) {
    document.querySelectorAll('.subject-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  function updateQuestion() {
    const q = questions[currentQ];
    document.getElementById('questionNum').textContent = `Question ${currentQ + 1} of ${questions.length}`;
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('quizProgressBar').style.width = `${((currentQ + 1) / questions.length) * 100}%`;
    const optEls = document.querySelectorAll('.quiz-option');
    const labels = ['A', 'B', 'C', 'D'];
    optEls.forEach((el, i) => {
      el.className = 'quiz-option';
      el.onclick = () => selectOption(el, labels[i]);
      el.querySelector('.option-circle').textContent = labels[i];
      el.childNodes[1].textContent = q.opts[i];
    });
    selectedOpt = null;
  }

  function selectOption(el, letter) {
    document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedOpt = letter;
  }

  function nextQuestion() {
    if (selectedOpt === questions[currentQ].ans) score++;
    currentQ++;
    if (currentQ >= questions.length) { submitQuiz(); return; }
    updateQuestion();
  }

  function submitQuiz() {
    if (selectedOpt === questions[currentQ]?.ans) score++;
    document.getElementById('quizContent').classList.add('hidden');
    document.getElementById('quizScore').classList.remove('hidden');
    document.getElementById('scoreNum').textContent = score;
  }

  function resetQuiz() {
    currentQ = 0; score = 0; selectedOpt = null;
    document.getElementById('quizContent').classList.remove('hidden');
    document.getElementById('quizScore').classList.add('hidden');
    updateQuestion();
  }

  function setFeedbackRating(n) {
    const stars = document.querySelectorAll('#feedbackStars span');
    stars.forEach((s, i) => { s.textContent = i < n ? '★' : '☆'; s.style.color = i < n ? '#f59e0b' : 'inherit'; });
  }

  function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    const messages = document.getElementById('chatMessages');
    messages.innerHTML += `<div class="chat-msg user"><div class="chat-bubble">${msg}</div><div class="chat-time">Just now</div></div>`;
    input.value = '';
    setTimeout(() => {
      const reply = chatResponses[chatCount % chatResponses.length];
      chatCount++;
      messages.innerHTML += `<div class="chat-msg bot"><div class="chat-bubble">${reply}</div><div class="chat-time">Just now</div></div>`;
      messages.scrollTop = messages.scrollHeight;
    }, 800);
    messages.scrollTop = messages.scrollHeight;
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
    <div className="dashboard-page" id="page-student-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header"><div className="sidebar-brand"><div className="logo-icon">🏫</div><div className="sidebar-brand-name">Indian Springs School</div></div></div>
        <div className="sidebar-user"><div className="sidebar-avatar">👨‍🎓</div><div className="sidebar-user-name">Gunasekhar ravada</div><div className="sidebar-user-role">Class 10 (A) · Roll No. 25l35a0541</div></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main</div>
          <div className="sidebar-item active" onClick={(e) => switchDashSection('std-home', e.currentTarget)}><span className="icon">🏠</span>Dashboard</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-materials', e.currentTarget)}><span className="icon">📚</span>Study Materials</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-papers', e.currentTarget)}><span className="icon">📄</span>Previous Year Papers</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-quiz', e.currentTarget)}><span className="icon">🧠</span>Online Quiz</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-announcements', e.currentTarget)}><span className="icon">📣</span>Announcements</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-calendar', e.currentTarget)}><span className="icon">📅</span>Academic Calendar</div>
          <div className="sidebar-section-label">Resources</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-chat', e.currentTarget)}><span className="icon">💬</span>Chat Assistant</div>
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-feedback', e.currentTarget)}><span className="icon">⭐</span>Feedback</div>
          {/* Added My Profile Option */}
          <div className="sidebar-item" onClick={(e) => switchDashSection('std-profile', e.currentTarget)}><span className="icon">👤</span>My Profile</div>
        </nav>
        <div className="sidebar-footer"><div className="sidebar-item" onClick={() => navigate('home')} style={{ color: 'rgba(255,100,100,0.8)' }}><span className="icon">🚪</span>Logout</div></div>
      </aside>

      <div className="dashboard-main">
        <div className="dashboard-topbar">
          <div className="topbar-title" id="std-topbar-title">Dashboard</div>
          <div className="topbar-right">
            <div className="topbar-btn">🔔</div>
            <div className="topbar-btn">⚙️</div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', fontWeight: 700 }}>G</div>
          </div>
        </div>
        <div className="dashboard-content">

          {/* Home Section */}
          <div className="dash-section active" id="std-home">
            <div className="welcome-banner"><div className="welcome-title">Good Morning, Gunasekhar! 👋</div><div className="welcome-subtitle">Class 10A · Term 1  </div></div>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-icon" style={{ background: '#eff6ff' }}>📊</div><div className="stat-data"><div className="num">0%</div><div className="label">Overall Score</div></div></div>
              <div className="stat-card"><div className="stat-icon" style={{ background: '#f0fdf4' }}>✅</div><div className="stat-data"><div className="num">0%</div><div className="label">Attendance</div></div></div>
              <div className="stat-card"><div className="stat-icon" style={{ background: '#fef3c7' }}>🧠</div><div className="stat-data"><div className="num">1</div><div className="label">Quizzes Done</div></div></div>
              <div className="stat-card"><div className="stat-icon" style={{ background: '#fef2f2' }}>📚</div><div className="stat-data"><div className="num">0</div><div className="label">Pending Tasks</div></div></div>
            </div>
            <div className="cards-grid">
              <div className="card"><div className="card-header"><div className="card-title">📅 Today's Schedule</div></div><div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px' }}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '48px' }}>9:00 AM</span><span style={{ fontWeight: 600, fontSize: '0.87rem' }}>Mathematics</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px' }}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '48px' }}>10:30 AM</span><span style={{ fontWeight: 600, fontSize: '0.87rem' }}>Physics</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px' }}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '48px' }}>12:00 PM</span><span style={{ fontWeight: 600, fontSize: '0.87rem' }}>English</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'var(--bg)', borderRadius: '6px' }}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '48px' }}>2:00 PM</span><span style={{ fontWeight: 600, fontSize: '0.87rem' }}>Chemistry</span></div></div></div>
              <div className="card"><div className="card-header"><div className="card-title">📊 Subject Performance</div></div><div className="progress-bar-wrap"><div className="progress-label"><span>Mathematics</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>92%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '92%' }}></div></div></div><div className="progress-bar-wrap"><div className="progress-label"><span>Physics</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>88%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '88%' }}></div></div></div><div className="progress-bar-wrap"><div className="progress-label"><span>Chemistry</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>85%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '85%' }}></div></div></div><div className="progress-bar-wrap"><div className="progress-label"><span>English</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>79%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: '79%' }}></div></div></div></div>
              <div className="card"><div className="card-header"><div className="card-title">📣 Latest Notice</div></div><div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}><div style={{ padding: '0.7rem', background: 'var(--bg)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Pre-Board Exam Schedule Released</div><div className="text-muted text-sm">Dec 2, 2026</div></div><div style={{ padding: '0.7rem', background: 'var(--bg)', borderRadius: '8px', borderLeft: '3px solid var(--secondary)' }}><div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Science Fair Registration Open</div><div className="text-muted text-sm">Nov 30, 2026</div></div></div></div>
            </div>
          </div>

          {/* Study Materials */}
          <div className="dash-section" id="std-materials">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📚 Study Materials</h2>
            <div className="subject-tabs">
              <div className="subject-tab active" onClick={(e) => switchSubject(e.currentTarget)}>All</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>Mathematics</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>Physics</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>Chemistry</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>English</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>Telugu</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>Hindi</div>
              <div className="subject-tab" onClick={(e) => switchSubject(e.currentTarget)}>Social Studies</div>
            </div>
            <div className="materials-list">
              <div className="material-item"><span className="material-icon">📘</span><div className="material-info"><div className="material-name">Mathematics — Chapter 5: Quadratic Equations</div><div className="material-meta">PDF · 2.4 MB · Uploaded Nov 28, 2026</div></div><span className="material-action">Download ↓</span></div>
              <div className="material-item"><span className="material-icon">📗</span><div className="material-info"><div className="material-name">Physics — Wave Optics Notes</div><div className="material-meta">PDF · 3.1 MB · Uploaded Nov 25, 2026</div></div><span className="material-action">Download ↓</span></div>
              <div className="material-item"><span className="material-icon">📙</span><div className="material-info"><div className="material-name">Chemistry — Organic Reactions Summary</div><div className="material-meta">PDF · 1.8 MB · Uploaded Nov 22, 2026</div></div><span className="material-action">Download ↓</span></div>
              <div className="material-item"><span className="material-icon">📕</span><div className="material-info"><div className="material-name">English — Prose &amp; Poetry Analysis</div><div className="material-meta">PDF · 1.2 MB · Uploaded Nov 20, 2026</div></div><span className="material-action">Download ↓</span></div>
              <div className="material-item"><span className="material-icon">📓</span><div className="material-info"><div className="material-name">Social Studies — History Chapter 8 Notes</div><div className="material-meta">PDF · 2.0 MB · Uploaded Nov 18, 2026</div></div><span className="material-action">Download ↓</span></div>
              <div className="material-item"><span className="material-icon">📒</span><div className="material-info"><div className="material-name">Telugu — Grammar and Composition Guide</div><div className="material-meta">PDF · 1.5 MB · Uploaded Nov 15, 2026</div></div><span className="material-action">Download ↓</span></div>
              <div className="material-item"><span className="material-icon">📔</span><div className="material-info"><div className="material-name">Hindi — Literature Study Guide</div><div className="material-meta">PDF · 1.3 MB · Uploaded Nov 12, 2026</div></div><span className="material-action">Download ↓</span></div>
            </div>
          </div>

          {/* Previous Year Papers */}
          <div className="dash-section" id="std-papers">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📄 Previous Year Question Papers</h2>
            <div className="cards-grid">
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => showToast('Downloading Mathematics 2023 Paper...', '')}><div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📄</div><div className="card-title">Mathematics</div><div className="text-muted text-sm mt-1">Board Exam 2023</div><div className="material-action mt-2" style={{ display: 'inline-block' }}>Download PDF →</div></div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => showToast('Downloading Physics 2023 Paper...', '')}><div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📄</div><div className="card-title">Physics</div><div className="text-muted text-sm mt-1">Board Exam 2023</div><div className="material-action mt-2" style={{ display: 'inline-block' }}>Download PDF →</div></div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => showToast('Downloading Chemistry 2023 Paper...', '')}><div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📄</div><div className="card-title">Chemistry</div><div className="text-muted text-sm mt-1">Board Exam 2023</div><div className="material-action mt-2" style={{ display: 'inline-block' }}>Download PDF →</div></div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => showToast('Downloading English 2023 Paper...', '')}><div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📄</div><div className="card-title">English</div><div className="text-muted text-sm mt-1">Board Exam 2023</div><div className="material-action mt-2" style={{ display: 'inline-block' }}>Download PDF →</div></div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => showToast('Downloading Mathematics 2022 Paper...', '')}><div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📄</div><div className="card-title">Mathematics</div><div className="text-muted text-sm mt-1">Board Exam 2022</div><div className="material-action mt-2" style={{ display: 'inline-block' }}>Download PDF →</div></div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => showToast('Downloading Physics 2022 Paper...', '')}><div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📄</div><div className="card-title">Physics</div><div className="text-muted text-sm mt-1">Board Exam 2022</div><div className="material-action mt-2" style={{ display: 'inline-block' }}>Download PDF →</div></div>
            </div>
          </div>

          {/* Quiz */}
          <div className="dash-section" id="std-quiz">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>🧠 Online Quiz — Mathematics</h2>
            <div className="quiz-container" id="quizContent">
              <div className="quiz-progress"><div className="quiz-progress-bar" id="quizProgressBar" style={{ width: '10%' }}></div></div>
              <div className="question-card">
                <div className="question-num" id="questionNum">Question 1 of 10</div>
                <div className="question-text" id="questionText">What is the value of x in the equation 2x + 5 = 15?</div>
                <div className="quiz-options" id="quizOptions">
                  <div className="quiz-option" onClick={(e) => selectOption(e.currentTarget, 'A')}><div className="option-circle">A</div>x = 5</div>
                  <div className="quiz-option" onClick={(e) => selectOption(e.currentTarget, 'B')}><div className="option-circle">B</div>x = 10</div>
                  <div className="quiz-option" onClick={(e) => selectOption(e.currentTarget, 'C')}><div className="option-circle">C</div>x = 4</div>
                  <div className="quiz-option" onClick={(e) => selectOption(e.currentTarget, 'D')}><div className="option-circle">D</div>x = 7</div>
                </div>
              </div>
              <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
                <button className="btn-submit" onClick={nextQuestion}>Next Question →</button>
                <button className="btn-secondary" onClick={submitQuiz}>Submit Quiz</button>
              </div>
            </div>
            <div className="hidden" id="quizScore">
              <div className="score-display">
                <div className="score-circle"><div className="score-num" id="scoreNum">8</div><div className="score-total">/ 10</div></div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.5rem' }}>Great Work! 🎉</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>You scored 80% in this Mathematics quiz.</p>
                <button className="btn-submit" onClick={resetQuiz}>Retake Quiz</button>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="dash-section" id="std-announcements">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📣 Announcements</h2>
            <div className="announcements-list">
              <div className="announcement-item"><span className="ann-badge badge-new">NEW</span><div className="ann-content"><div className="ann-title">Pre-Board Examination Schedule — December 2026</div><div className="ann-meta">Posted by Academic Office · Dec 2, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-event">EVENT</span><div className="ann-content"><div className="ann-title">Annual Science Fair — Project Submission by Dec 10</div><div className="ann-meta">Posted by Science Dept. · Nov 30, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-notice">NOTICE</span><div className="ann-content"><div className="ann-title">Library Books Return Deadline — December 12</div><div className="ann-meta">Posted by Library · Nov 28, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-event">EVENT</span><div className="ann-content"><div className="ann-title">Annual Sports Day Participation Form Available</div><div className="ann-meta">Posted by PE Dept. · Nov 25, 2026</div></div></div>
              <div className="announcement-item"><span className="ann-badge badge-notice">NOTICE</span><div className="ann-content"><div className="ann-title">Fee Payment Reminder — Last Date Dec 15</div><div className="ann-meta">Posted by Accounts · Nov 22, 2026</div></div></div>
            </div>
          </div>

          {/* Calendar */}
          <div className="dash-section" id="std-calendar">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>📅 Academic Calendar — December 2026</h2>
            <div className="card" style={{ maxWidth: '420px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}><button className="topbar-btn">‹</button><div style={{ fontWeight: 700 }}>December 2026</div><button className="topbar-btn">›</button></div>
              <div className="calendar-grid-header">
                <div className="calendar-day-label">Su</div><div className="calendar-day-label">Mo</div><div className="calendar-day-label">Tu</div><div className="calendar-day-label">We</div><div className="calendar-day-label">Th</div><div className="calendar-day-label">Fr</div><div className="calendar-day-label">Sa</div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-day other-month">24</div><div className="calendar-day other-month">25</div><div className="calendar-day other-month">26</div><div className="calendar-day other-month">27</div><div className="calendar-day other-month">28</div><div className="calendar-day other-month">29</div><div className="calendar-day other-month">30</div>
                <div className="calendar-day other-month">1</div><div className="calendar-day">2</div><div className="calendar-day">3</div><div className="calendar-day">4</div><div className="calendar-day">5</div><div className="calendar-day">6</div><div className="calendar-day">7</div>
                <div className="calendar-day">8</div><div className="calendar-day">9</div><div className="calendar-day">10</div><div className="calendar-day">11</div><div className="calendar-day">12</div><div className="calendar-day">13</div><div className="calendar-day today has-event">14</div>
                <div className="calendar-day has-event">15</div><div className="calendar-day">16</div><div className="calendar-day">17</div><div className="calendar-day has-event">18</div><div className="calendar-day">19</div><div className="calendar-day">20</div><div className="calendar-day">21</div>
                <div className="calendar-day">22</div><div className="calendar-day">23</div><div className="calendar-day">24</div><div className="calendar-day">25</div><div className="calendar-day">26</div><div className="calendar-day">27</div><div className="calendar-day">28</div>
                <div className="calendar-day">29</div><div className="calendar-day">30</div><div className="calendar-day">31</div>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Upcoming Events</h3>
              <div className="upcoming-event-chip"><span className="event-chip-date">Dec 14</span><span className="event-chip-name">Parent-Teacher Meeting</span><span className="event-chip-badge">PTM</span></div>
              <div className="upcoming-event-chip"><span className="event-chip-date">Dec 15</span><span className="event-chip-name">Annual Sports Day</span><span className="event-chip-badge">Sports</span></div>
              <div className="upcoming-event-chip"><span className="event-chip-date">Dec 18</span><span className="event-chip-name">Science Fair 2025</span><span className="event-chip-badge">Academic</span></div>
              <div className="upcoming-event-chip"><span className="event-chip-date">Dec 22</span><span className="event-chip-name">Winter Break Begins</span><span className="event-chip-badge">Holiday</span></div>
            </div>
          </div>

          {/* Chat */}
          <div className="dash-section" id="std-chat">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>💬 Study Assistant</h2>
            <div className="chat-container">
              <div className="chat-header"><div className="chat-avatar">🤖</div><div><div className="chat-name">Vidya AI Assistant</div><div className="chat-status">Online · Ready to help</div></div></div>
              <div className="chat-messages" id="chatMessages">
                <div className="chat-msg bot"><div className="chat-bubble">Hello Gunasekhar! 👋 I'm your study assistant. Ask me anything about your subjects, upcoming exams, or school schedule!</div><div className="chat-time">Just now</div></div>
              </div>
              <div className="chat-input-wrap">
                <input className="chat-input" id="chatInput" placeholder="Ask about a topic, formula, or concept..." onKeyPress={(e) => { if (e.key === 'Enter') sendChat(); }} />
                <button className="chat-send" onClick={sendChat}>→</button>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="dash-section" id="std-feedback">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>⭐ Submit Feedback</h2>
            <div className="card" style={{ maxWidth: '600px' }}>
              <div className="form-group"><label className="form-label">Feedback Category</label><select className="form-select"><option>Academic Quality</option><option>Teaching Methods</option><option>Infrastructure</option><option>Administration</option><option>Other</option></select></div>
              <div className="form-group"><label className="form-label">Your Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.8rem', cursor: 'pointer' }} id="feedbackStars">
                  <span onClick={() => setFeedbackRating(1)}>☆</span><span onClick={() => setFeedbackRating(2)}>☆</span><span onClick={() => setFeedbackRating(3)}>☆</span><span onClick={() => setFeedbackRating(4)}>☆</span><span onClick={() => setFeedbackRating(5)}>☆</span>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Your Feedback</label><textarea className="form-textarea" placeholder="Share your experience..."></textarea></div>
              <button className="btn-submit" onClick={() => showToast('Feedback submitted successfully! Thank you.', 'success')}>Submit Feedback</button>
            </div>
          </div>

          {/* Added Student My Profile Container */}
          <div className="dash-section" id="std-profile">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>👤 My Profile Settings</h2>
            <div className="card" style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Account Information</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Name:</strong> Gunasekhar ravada</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Role:</strong> Student (Class 10A)</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Roll No:</strong> 25l35a0541</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0' }}><strong>Parent Email:</strong> gunasekharravada@gmail.com</p>
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