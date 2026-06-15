import './ContactPage.css';

export default function ContactPage({ navigate, showToast }) {
  function setRating(n) {
    const stars = document.querySelectorAll('#starRating .star-btn');
    stars.forEach((s, i) => {
      s.textContent = i < n ? '★' : '☆';
      s.style.color = i < n ? '#fbbf24' : 'rgba(255,255,255,0.6)';
    });
  }

  return (
    <div className="page" id="page-contact">
      <div className="page-hero">
        <h1 className="page-hero-title">Contact &amp; Feedback</h1>
        <p className="page-hero-sub">We'd love to hear from you. Reach out anytime.</p>
      </div>
      <section className="section section-alt">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-card">
              <div className="contact-info-title">Get In Touch</div>
              <div className="contact-info-sub">Our admissions team is available Monday through Saturday to assist you.</div>
              <div className="contact-info-item"><div className="contact-info-icon">📍</div><div><div className="contact-info-label">Address</div><div className="contact-info-value">Vidyalaya Campus, Koramangala, Bengaluru 560034, Karnataka</div></div></div>
              <div className="contact-info-item"><div className="contact-info-icon">📞</div><div><div className="contact-info-label">Phone</div><div className="contact-info-value">+91 80 1234 5678</div></div></div>
              <div className="contact-info-item"><div className="contact-info-icon">✉️</div><div><div className="contact-info-label">Email</div><div className="contact-info-value">info@vidyalaya.edu.in</div></div></div>
              <div className="contact-info-item"><div className="contact-info-icon">🕐</div><div><div className="contact-info-label">Office Hours</div><div className="contact-info-value">Mon–Sat: 8:00 AM – 4:30 PM</div></div></div>
              <div className="divider" style={{ borderColor: 'rgba(255,255,255,0.2)' }}></div>
              <div className="contact-info-title" style={{ fontSize: '1rem' }}>Feedback</div>
              <div style={{ marginTop: '1rem' }}>
                <label style={{ fontSize: '0.82rem', opacity: 0.8, display: 'block', marginBottom: '0.4rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', cursor: 'pointer' }} id="starRating">
                  <span onClick={() => setRating(1)} className="star-btn">☆</span>
                  <span onClick={() => setRating(2)} className="star-btn">☆</span>
                  <span onClick={() => setRating(3)} className="star-btn">☆</span>
                  <span onClick={() => setRating(4)} className="star-btn">☆</span>
                  <span onClick={() => setRating(5)} className="star-btn">☆</span>
                </div>
              </div>
              <textarea className="form-textarea" style={{ marginTop: '0.8rem', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.85rem' }} placeholder="Your feedback message..."></textarea>
              <button className="btn-submit" style={{ marginTop: '0.8rem', width: '100%' }} onClick={() => showToast('Feedback submitted! Thank you.', 'success')}>Submit Feedback</button>
            </div>
            <div className="contact-form-card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.3rem' }}>Send a Message</h3>
              <p className="text-muted text-sm mb-3">Fill in the form and we'll get back to you within 24 hours.</p>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your full name" /></div>
                <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="your@email.com" /></div>
              </div>
              <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" type="tel" placeholder="+91 98765 43210" /></div>
              <div className="form-group"><label className="form-label">Subject</label>
                <select className="form-select">
                  <option>General Enquiry</option>
                  <option>Admissions</option>
                  <option>Academics</option>
                  <option>Fee &amp; Finance</option>
                  <option>Complaint</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Write your message here..."></textarea></div>
              <button className="btn-submit" onClick={() => showToast("Message sent! We'll respond within 24 hours.", 'success')}>Send Message ✉️</button>
            </div>
          </div>
        </div>
      </section>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}
