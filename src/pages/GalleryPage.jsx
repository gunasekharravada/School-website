import './GalleryPage.css';
import cultural from '../images/cultural.jpeg';
import library from '../images/library.jpeg';
import sciencefair from '../images/sciencefair.jpeg';
import sports from '../images/sports.jpeg';
import dances from '../images/dances.jpeg';

export default function GalleryPage({ navigate }) {
  // Filters elements imperatively from DOM lists safely
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
    <div className="page active" id="page-gallery">
      <div className="page-hero">
        <h1 className="page-hero-title">School Gallery</h1>
        <p className="page-hero-sub">A glimpse into life at Vidyalaya — vibrant, enriching, and full of stories.</p>
      </div>

      <section className="section section-alt">
        <div className="container">
          {/* Categories Navigation Bar */}
          <div className="gallery-categories">
            <button className="gallery-cat-btn active" onClick={(e) => filterGallery('all', e.currentTarget)}>All</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('campus', e.currentTarget)}>🏫 Campus</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('sports', e.currentTarget)}>⚽ Sports</button>
            <button className="gallery-cat-btn" onClick={(e) => filterGallery('cultural', e.currentTarget)}>🎭 Cultural &amp; Arts</button>
          </div>

          {/* Full Grid Layout containing imported images directly */}
          <div className="gallery-full-grid" id="galleryGrid">
            {/* Sports Item */}
            <div className="gallery-full-item" data-cat="sports">
              <div className="gallery-bg">
                <img src={sports} alt="Sports Day" className="gallery-img" />
              </div>
              <div className="gallery-overlay">Sports</div>
            </div>

            {/* Cultural Item */}
            <div className="gallery-full-item" data-cat="cultural">
              <div className="gallery-bg">
                <img src={cultural} alt="Annual Fest" className="gallery-img" />
              </div>
              <div className="gallery-overlay">Teachers Day</div>
            </div>

            {/* Science Fair Item listed under Campus life / Academics */}
            <div className="gallery-full-item" data-cat="campus">
              <div className="gallery-bg">
                <img src={sciencefair} alt="Science Exhibition" className="gallery-img" />
              </div>
              <div className="gallery-overlay">Science Fair &amp; Innovation Lab</div>
            </div>

            {/* Library Item */}
            <div className="gallery-full-item" data-cat="campus">
              <div className="gallery-bg">
                <img src={library} alt="School Library" className="gallery-img" />
              </div>
              <div className="gallery-overlay">Central Digital Library</div>
            </div>

            {/* Dance Performance Item */}
            <div className="gallery-full-item" data-cat="cultural">
              <div className="gallery-bg">
                <img src={dances} alt="Dance Performances" className="gallery-img" />
              </div>
              <div className="gallery-overlay">Classical Dance Showcase</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Return Utility Action */}
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}