import './EventsPage.css';

export default function EventsPage({ navigate }) {
  return (
    <div className="page" id="page-events">
      <div className="page-hero">
        <h1 className="page-hero-title">Events &amp; Calendar</h1>
        <p className="page-hero-sub">Stay connected with what's happening at Vidyalaya.</p>
      </div>
      <section className="section section-alt">
        <div className="container">
          <div className="events-grid">
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">14</div><div className="event-month">Dec</div></div><span>PTM</span></div><div className="event-info"><div className="event-title">Parent-Teacher Meeting</div><div className="event-desc">Semester progress review sessions</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">15</div><div className="event-month">Dec</div></div><span>Sports</span></div><div className="event-info"><div className="event-title">Annual Sports Day</div><div className="event-desc">Athletic meet with cultural performances</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">18</div><div className="event-month">Dec</div></div><span>Academic</span></div><div className="event-info"><div className="event-title">Science Fair 2024</div><div className="event-desc">Student project presentations</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">22</div><div className="event-month">Dec</div></div><span>Holiday</span></div><div className="event-info"><div className="event-title">Winter Break Begins</div><div className="event-desc">School resumes January 6, 2025</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">26</div><div className="event-month">Jan</div></div><span>National</span></div><div className="event-info"><div className="event-title">Republic Day Celebration</div><div className="event-desc">Flag hoisting, parade and cultural programme</div></div></div>
            <div className="event-card"><div className="event-date-bar"><div><div className="event-day">14</div><div className="event-month">Feb</div></div><span>Academic</span></div><div className="event-info"><div className="event-title">Pre-Board Exams Begin</div><div className="event-desc">Class 10 &amp; 12 pre-board examinations</div></div></div>
          </div>
        </div>
      </section>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}
