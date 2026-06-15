import './GalleryPage.css';

export default function GalleryPage({ navigate }) {
  function filterGallery(cat, btn) {
    document.querySelectorAll('.gallery-cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.gallery-full-item').forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  return (
    <div className="page" id="page-gallery">
      <div className="page-hero">
        <h1 className="page-hero-title">School Gallery</h1>
        <p className="page-hero-sub">A glimpse into life at Vidyalaya — vibrant, enriching, and full of stories.</p>
      </div>
      <section className="section section-alt">
        <div className="container">
          <div className="gallery-categories">
            <button className="gallery-cat-btn active" onClick={(e) => filterGallery('all', e.currentTarget)}>All</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('campus', e.currentTarget)}>🏫 Campus</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('sports', e.currentTarget)}>⚽ Sports</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('cultural', e.currentTarget)}>🎭 Cultural</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('functions', e.currentTarget)}>🎓 Functions</button>
          </div>
          <div className="gallery-full-grid" id="galleryGrid">
            <div className="gallery-full-item" data-cat="campus"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🏫</span></div><div className="gallery-overlay">Main Building</div></div>
            <div className="gallery-full-item" data-cat="sports"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>⚽</span></div><div className="gallery-overlay">Sports Day 2024</div></div>
            <div className="gallery-full-item" data-cat="cultural"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🎭</span></div><div className="gallery-overlay">Annual Day</div></div>
            <div className="gallery-full-item" data-cat="campus"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#10b981,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🔬</span></div><div className="gallery-overlay">Science Lab</div></div>
            <div className="gallery-full-item" data-cat="functions"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#f59e0b,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🎓</span></div><div className="gallery-overlay">Graduation Day</div></div>
            <div className="gallery-full-item" data-cat="sports"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#ef4444,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🏆</span></div><div className="gallery-overlay">Trophy Cabinet</div></div>
            <div className="gallery-full-item" data-cat="cultural"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🎶</span></div><div className="gallery-overlay">Music Competition</div></div>
            <div className="gallery-full-item" data-cat="campus"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#0ea5e9,#1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>📚</span></div><div className="gallery-overlay">School Library</div></div>
            <div className="gallery-full-item" data-cat="functions"><div className="gallery-bg" style={{ background: 'linear-gradient(135deg,#1e3a8a,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '3rem' }}>🌸</span></div><div className="gallery-overlay">Teachers' Day</div></div>
          </div>
        </div>
      </section>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}
