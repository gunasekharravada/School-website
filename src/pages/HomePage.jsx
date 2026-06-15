import './HomePage.css';

export default function HomePage({ navigate, showToast }) {
  return (
    <div className="page active" id="page-home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">🏆 Ranked #1 School in the District</div>
            <h1 className="hero-title">Where Young Minds <span className="accent-text">Discover</span> &amp; Excel</h1>
            <p className="hero-subtitle">Vidyalaya School of Excellence offers world-class education, holistic development, and a nurturing environment for students from Class 1 to Class 12.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('admission')}>Apply for Admission ✦</button>
              <button className="btn-outline-white" onClick={() => navigate('academics')}>Explore Academics →</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="num">4,200+</div><div className="label">Students</div></div>
              <div className="hero-stat"><div className="num">98%</div><div className="label">Pass Rate</div></div>
              <div className="hero-stat"><div className="num">25+</div><div className="label">Years Legacy</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card"><div className="card-icon">📚</div><div className="card-title">Today's Schedule</div><div className="card-value">Physics → Math → English → P.E.</div></div>
            <div className="hero-card"><div className="card-icon">📣</div><div className="card-title">Latest Announcement</div><div className="card-value">Annual Sports Day — Dec 15th 🏅</div></div>
            <div className="hero-card"><div className="card-icon">📊</div><div className="card-title">Board Results 2024</div><div className="card-value">Class 12: 98.4% | Class 10: 99.1%</div></div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Legacy</span>
            <h2 className="section-title">School Achievements</h2>
            <p className="section-sub">Decades of excellence reflected in our students' achievements and institutional milestones.</p>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card"><div className="ach-icon">🏆</div><div className="ach-number">48</div><div className="ach-label">State Awards Won</div></div>
            <div className="achievement-card"><div className="ach-icon">🎓</div><div className="ach-number">15,000+</div><div className="ach-label">Alumni Worldwide</div></div>
            <div className="achievement-card"><div className="ach-icon">🔬</div><div className="ach-number">12</div><div className="ach-label">Labs &amp; Innovation Hubs</div></div>
            <div className="achievement-card"><div className="ach-icon">⚽</div><div className="ach-number">200+</div><div className="ach-label">Sports Trophies</div></div>
            <div className="achievement-card"><div className="ach-icon">🌍</div><div className="ach-number">98%</div><div className="ach-label">Board Exam Pass Rate</div></div>
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Stay Updated</span>
            <h2 className="section-title">Latest Announcements</h2>
          </div>
          <div className="announcements-list">
            <div className="announcement-item"><span className="ann-badge badge-new">NEW</span><div className="ann-content"><div className="ann-title">Admissions Open for 2025–26 Academic Year</div><div className="ann-meta">Posted on December 1, 2024 · Administration</div></div></div>
            <div className="announcement-item"><span className="ann-badge badge-event">EVENT</span><div className="ann-content"><div className="ann-title">Annual Science Fair — Register by December 10</div><div className="ann-meta">Posted on November 28, 2024 · Science Department</div></div></div>
            <div className="announcement-item"><span className="ann-badge badge-notice">NOTICE</span><div className="ann-content"><div className="ann-title">Winter Break: December 22 to January 5</div><div className="ann-meta">Posted on November 25, 2024 · Academic Office</div></div></div>
            <div className="announcement-item"><span className="ann-badge badge-event">EVENT</span><div className="ann-content"><div className="ann-title">Parent-Teacher Meeting — December 14, 2024</div><div className="ann-meta">Posted on November 22, 2024 · Principal's Office</div></div></div>
            <div className="announcement-item"><span className="ann-badge badge-new">NEW</span><div className="ann-content"><div className="ann-title">Smart Classroom Inauguration — Block C Ready</div><div className="ann-meta">Posted on November 20, 2024 · Facilities</div></div></div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Mark Your Calendar</span>
            <h2 className="section-title">Upcoming Events</h2>
          </div>
          <div className="events-grid">
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">14</div><div className="event-month">Dec</div></div><span>Parent-Teacher Meeting</span></div><div className="event-info"><div className="event-title">Semester Progress Review</div><div className="event-desc">Individual meetings with all class teachers from 9 AM – 2 PM</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">15</div><div className="event-month">Dec</div></div><span>Annual Sports Day</span></div><div className="event-info"><div className="event-title">Athletic Meet 2024</div><div className="event-desc">Track events, team sports, and cultural performances. All students participate.</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">18</div><div className="event-month">Dec</div></div><span>Science Fair</span></div><div className="event-info"><div className="event-title">Innovate &amp; Inspire 2024</div><div className="event-desc">Student project presentations judged by external panel of educators.</div></div></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Voices That Matter</span>
            <h2 className="section-title">What Our Community Says</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card"><div className="stars">★★★★★</div><p className="testimonial-text">Vidyalaya gave my daughter more than textbook knowledge. The teachers genuinely care, and the campus gives every child room to grow into the best version of themselves.</p><div className="testimonial-author"><div className="author-avatar" style={{ background: '#dbeafe', color: '#1d4ed8' }}>R</div><div><div className="author-name">Radha Krishnamurthy</div><div className="author-role">Parent of Class 11 Student</div></div></div></div>
            <div className="testimonial-card"><div className="stars">★★★★★</div><p className="testimonial-text">I got into IIT Bombay after studying here. The coaching, the labs, the dedication of every single teacher — Vidyalaya builds IITians before the exam even starts.</p><div className="testimonial-author"><div className="author-avatar" style={{ background: '#dcfce7', color: '#15803d' }}>A</div><div><div className="author-name">Arjun Nair</div><div className="author-role">Alumni — IIT Bombay, 2023</div></div></div></div>
            <div className="testimonial-card"><div className="stars">★★★★★</div><p className="testimonial-text">Teaching here is a privilege. Students are curious, parents are engaged, and the administration empowers us with every resource we need. Best decision of my career.</p><div className="testimonial-author"><div className="author-avatar" style={{ background: '#fef3c7', color: '#b45309' }}>P</div><div><div className="author-name">Priya Mehta</div><div className="author-role">Senior Science Teacher</div></div></div></div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Campus Life</span>
            <h2 className="section-title">Gallery Preview</h2>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)' }}>🏫</div><div className="gallery-overlay">Campus View</div></div>
            <div className="gallery-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>⚽</div><div className="gallery-overlay">Sports Day</div></div>
            <div className="gallery-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#10b981,#0ea5e9)' }}>🔬</div><div className="gallery-overlay">Science Fair</div></div>
            <div className="gallery-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>🎭</div><div className="gallery-overlay">Cultural Events</div></div>
            <div className="gallery-item"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#f59e0b,#10b981)' }}>📚</div><div className="gallery-overlay">Library</div></div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn-submit" onClick={() => navigate('gallery')}>View Full Gallery →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand"><div className="logo-icon">🏫</div><div className="footer-brand-name">Vidyalaya</div></div>
              <p className="footer-desc">A premier institution committed to excellence in academics, sports, and character development since 1999. Shaping tomorrow's leaders today.</p>
              <div className="footer-social">
                <div className="social-btn">f</div>
                <div className="social-btn">in</div>
                <div className="social-btn">tw</div>
                <div className="social-btn">yt</div>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Quick Links</div>
              <div className="footer-links">
                <a onClick={() => navigate('about')}>About Us</a>
                <a onClick={() => navigate('academics')}>Academics</a>
                <a onClick={() => navigate('admission')}>Admissions</a>
                <a onClick={() => navigate('gallery')}>Gallery</a>
                <a onClick={() => navigate('contact')}>Contact</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Academics</div>
              <div className="footer-links">
                <a>Primary School</a>
                <a>Middle School</a>
                <a>High School</a>
                <a>Science Stream</a>
                <a>Commerce Stream</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <div className="footer-contact-item"><span>📍</span><span>Vidyalaya Campus, Koramangala, Bengaluru 560034</span></div>
              <div className="footer-contact-item"><span>📞</span><span>+91 80 1234 5678</span></div>
              <div className="footer-contact-item"><span>✉️</span><span>info@vidyalaya.edu.in</span></div>
              <div className="footer-contact-item"><span>🕐</span><span>Mon–Sat: 8:00 AM – 4:30 PM</span></div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2024 Vidyalaya School of Excellence. All rights reserved.</span>
            <span>Privacy Policy · Terms of Use</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
