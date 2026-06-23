import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig'; 
import './HomePage.css';
import { FaFacebook, FaWhatsapp, FaYoutube, FaEnvelope, FaMapMarkedAlt, FaClock, FaPhoneAlt } from "react-icons/fa";
import cultural from '../images/cultural.jpeg';
import library from '../images/library.jpeg';
import sciencefair from '../images/sciencefair.jpeg';
import sports from '../images/sports.jpeg';
import dances from '../images/dances.jpeg'; // Added the 5th image import

export default function HomePage({ navigate, showToast }) {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    // Fetch Latest Announcements
    const fetchAnnouncements = async () => {
      try {
        const noticesRef = collection(db, 'notices');
        const q = query(noticesRef, orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        
        const fetchedNotices = [];
        querySnapshot.forEach((doc) => {
          fetchedNotices.push({ id: doc.id, ...doc.data() });
        });
        
        if (fetchedNotices.length > 0) {
          setAnnouncements(fetchedNotices);
        }
      } catch (error) {
        console.error("Error fetching announcements: ", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    // Fetch Upcoming Events dynamically from 'events' collection
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('date', 'asc'), limit(3));
        const querySnapshot = await getDocs(q);
        
        const fetchedEvents = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          let day = "15";
          let month = "Dec";
          if (data.date) {
            const dateObj = data.date.toDate ? data.date.toDate() : new Date(data.date);
            day = dateObj.getDate();
            month = dateObj.toLocaleString('en-US', { month: 'short' });
          }

          fetchedEvents.push({
            id: doc.id,
            day: day,
            month: month,
            tag: data.tag || 'Event',
            title: data.title || 'Untitled Event',
            desc: data.desc || 'No description provided.'
          });
        });
        
        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchAnnouncements();
    fetchEvents();
  }, []);

  const getBadgeClass = (type) => {
    switch(type?.toLowerCase()) {
      case 'new': return 'badge-new';
      case 'event': return 'badge-event';
      case 'notice': return 'badge-notice';
      default: return 'badge-notice';
    }
  };

  return (
    <div className="page active" id="page-home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">🏆 Ranked #1 School in the District</div>
            <h1 className="hero-title">Indian <span className="accent-text">Springs</span> School</h1>
            <p className="hero-subtitle">A comprehensive digital learning platform for students, teachers, and parents. Access Study materials, take quizzes and more from Class 6 to Class 10 students.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('admission')}>Apply for Admission ✦</button>
              <button className="btn-outline-white" onClick={() => navigate('academics')}>Explore Academics →</button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="num">500+</div><div className="label">Students</div></div>
              <div className="hero-stat"><div className="num">98%</div><div className="label">Pass Rate</div></div>
              <div className="hero-stat"><div className="num">15+</div><div className="label">Years Legacy</div></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card"><div className="card-icon">📚</div><div className="card-title">Today's Schedule</div><div className="card-value">Physics → Math → English → P.E.</div></div>
            <div className="hero-card"><div className="card-icon">📣</div><div className="card-title">Latest Announcement</div><div className="card-value">Annual Sports Day — Dec 15th 🏅</div></div>
            <div className="hero-card"><div className="card-icon">📊</div><div className="card-title">Board Results 2026</div><div className="card-value">Class 10: 90.4% | Class 8-9: 90.1%</div></div>
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
            <div className="achievement-card"><div className="ach-icon">🎓</div><div className="ach-number">5,000+</div><div className="ach-label">Alumni Worldwide</div></div>
            <div className="achievement-card"><div className="ach-icon">🔬</div><div className="ach-number">10</div><div className="ach-label">Labs &amp; Innovation Hubs</div></div>
            <div className="achievement-card"><div className="ach-icon">⚽</div><div className="ach-number">100+</div><div className="ach-label">Sports Trophies</div></div>
            <div className="achievement-card"><div className="ach-icon">🌍</div><div className="ach-number">90%</div><div className="ach-label">Board Exam Pass Rate</div></div>
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
            {loadingAnnouncements ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading live announcements...</div>
            ) : announcements.length > 0 ? (
              announcements.map((ann) => (
                <div className="announcement-item" key={ann.id}>
                  <span className={`ann-badge ${getBadgeClass(ann.type || 'NEW')}`}>
                    {(ann.type || 'NEW').toUpperCase()}
                  </span>
                  <div className="ann-content">
                    <div className="ann-title">{ann.title}</div>
                    <div className="ann-meta">
                      Posted on {ann.postedDate || 'Recent'} · {ann.category || 'Administration'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="announcement-item"><span className="ann-badge badge-new">NEW</span><div className="ann-content"><div className="ann-title">Admissions Open for 2026–27 Academic Year</div><div className="ann-meta">Posted on June 12, 2026 · Administration</div></div></div>
                <div className="announcement-item"><span className="ann-badge badge-event">EVENT</span><div className="ann-content"><div className="ann-title">Annual Science Fair — Register by December 10</div><div className="ann-meta">Posted on November 28, 2026 · Science Department</div></div></div>
              </>
            )}
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
            {loadingEvents ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', width: '100%' }}>Loading live calendar...</div>
            ) : events.length > 0 ? (
              events.map((ev) => (
                <div className="event-card" key={ev.id}>
                  <div className="event-date-bar">
                    <div>
                      <div className="event-day">{ev.day}</div>
                      <div className="event-month">{ev.month}</div>
                    </div>
                    <span>{ev.tag}</span>
                  </div>
                  <div className="event-info">
                    <div className="event-title">{ev.title}</div>
                    <div className="event-desc">{ev.desc}</div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="event-card"><div className="event-date-bar"><div><div className="event-day">14</div><div className="event-month">Dec</div></div><span>PTM</span></div><div className="event-info"><div className="event-title">Semester Progress Review</div><div className="event-desc">Individual meetings with all class teachers from 9 AM – 2 PM</div></div></div>
                <div className="event-card"><div className="event-date-bar"><div><div className="event-day">15</div><div className="event-month">Dec</div></div><span>Sports</span></div><div className="event-info"><div className="event-title">Athletic Meet 2026</div><div className="event-desc">Track events, team sports, and cultural performances. All students participate.</div></div></div>
              </>
            )}
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

      {/* Aesthetic Gallery Preview */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Campus Life</span>
            <h2 className="section-title">Gallery Preview</h2>
          </div>
          <div className="gallery-grid">
            <div className="gallery-item"><div className="gallery-bg"><img src={sports} alt="Sports Day" className="gallery-img" /></div><div className="gallery-overlay">Sports Day</div></div>
            <div className="gallery-item"><div className="gallery-bg"><img src={sciencefair} alt="Science Fair" className="gallery-img" /></div><div className="gallery-overlay">Science Fair</div></div>
            <div className="gallery-item"><div className="gallery-bg"><img src={cultural} alt="Cultural Events" className="gallery-img" /></div><div className="gallery-overlay">Cultural Events</div></div>
            <div className="gallery-item"><div className="gallery-bg"><img src={library} alt="Library" className="gallery-img" /></div><div className="gallery-overlay">Library</div></div>
            {/* Newly added 5th image box element */}
            <div className="gallery-item"><div className="gallery-bg"><img src={dances} alt="Dance Performances" className="gallery-img" /></div><div className="gallery-overlay">Dance Performances</div></div>
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
              <p className="footer-desc">A premier institution committed to excellence in academics, sports, and character development since 2011. Shaping tomorrow's leaders today.</p>
              <div className="footer-social">
                <div className="social-btn"><FaFacebook/></div>
                <div className="social-btn"><FaWhatsapp/></div>
                <div className="social-btn"><FaYoutube/></div>
                <div className="social-btn"><FaEnvelope/></div>
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
                <a>6th class</a>
                <a>7th class</a>
                <a>8th class</a>
                <a>9th class</a>
                <a>10th class</a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <div className="footer-contact-item"><span><FaMapMarkedAlt/></span><span>NRI S INDIAN SPRINGS SCHOOL, Lakshminagar, Visakhapatnam,Andhra Pradesh 531173</span></div>
              <div className="footer-contact-item"><span><FaPhoneAlt/></span><span>+91 8977044167</span></div>
              <div className="footer-contact-item"><span><FaEnvelope/></span><span>info@indianspringsschool.edu.in</span></div>
              <div className="footer-contact-item"><span><FaClock/></span><span>Mon–Sat: 8:00 AM – 4:00 PM</span></div>
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