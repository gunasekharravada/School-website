import './AcademicsPage.css';

export default function AcademicsPage({ navigate }) {
  return (
    <div className="page" id="page-academics">
      <div className="page-hero">
        <h1 className="page-hero-title">Academics</h1>
        <p className="page-hero-sub">Rigorous curriculum designed to challenge, inspire, and prepare.</p>
      </div>
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Curriculum</span>
            <h2 className="section-title">Classes &amp; Streams</h2>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card"><div className="ach-icon">🌿</div><div className="ach-number">1–5</div><div className="ach-label">Primary School — Foundational Learning</div></div>
            <div className="achievement-card"><div className="ach-icon">📖</div><div className="ach-number">6–8</div><div className="ach-label">Middle School — Exploratory Phase</div></div>
            <div className="achievement-card"><div className="ach-icon">🧪</div><div className="ach-number">9–10</div><div className="ach-label">High School — Board Preparation</div></div>
            <div className="achievement-card"><div className="ach-icon">🎓</div><div className="ach-number">11–12</div><div className="ach-label">Senior Secondary — Science &amp; Commerce</div></div>
          </div>
        </div>
      </section>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}
