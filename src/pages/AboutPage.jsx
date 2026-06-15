import './AboutPage.css';

export default function AboutPage({ navigate }) {
  return (
    <div className="page" id="page-about">
      <div className="page-hero">
        <h1 className="page-hero-title">About Indian Springs School</h1>
        <p className="page-hero-sub">25 years of shaping young minds and building tomorrow's leaders.</p>
      </div>
      <section className="section section-alt">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-placeholder">
              🏫<span style={{ fontSize: '1rem', opacity: 0.8 }}>Campus, Visakhapatnam</span>
            </div>
            <div>
              <div className="about-label">Our Story</div>
              <h2 className="about-title">Built on a Foundation of Excellence</h2>
              <p className="about-text">Founded in 1999, Vidyalaya School of Excellence began with a single classroom and a bold vision: that every child deserves world-class education. Today, we are one of Karnataka's most respected institutions, serving 4,200+ students across classes 1 through 12.</p>
              <p className="about-text">Our faculty of 280 dedicated educators brings together expertise from top universities and a genuine passion for teaching. We pair rigorous academics with sports, arts, and leadership programmes to develop complete human beings, not just examination scorers.</p>
              <button className="btn-submit" onClick={() => navigate('admission')}>Join Our Family →</button>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What We Stand For</span>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="values-grid">
            <div className="value-card"><div className="value-icon">🌱</div><div className="value-title">Holistic Growth</div><div className="value-text">Academics, arts, sports, and character — developed together, not separately.</div></div>
            <div className="value-card"><div className="value-icon">🔬</div><div className="value-title">Inquiry-Based Learning</div><div className="value-text">We teach students to ask the right questions, not just memorise answers.</div></div>
            <div className="value-card"><div className="value-icon">🤝</div><div className="value-title">Community &amp; Belonging</div><div className="value-text">A campus where every student feels seen, heard, and valued.</div></div>
            <div className="value-card"><div className="value-icon">🌍</div><div className="value-title">Global Perspective</div><div className="value-text">Preparing students for a connected, competitive, and compassionate world.</div></div>
            <div className="value-card"><div className="value-icon">💡</div><div className="value-title">Innovation</div><div className="value-text">Smart classrooms, STEM labs, and a mindset that rewards curiosity.</div></div>
            <div className="value-card"><div className="value-icon">⚖️</div><div className="value-title">Integrity</div><div className="value-text">Honesty, accountability, and ethical courage in everything we do.</div></div>
          </div>
        </div>
      </section>
      <div style={{ padding: '3rem 2rem', background: 'white', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}
