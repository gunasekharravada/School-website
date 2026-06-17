import './AdmissionPage.css';

export default function AdmissionPage({ navigate, showToast }) {
  function submitAdmission() {
    const name = document.getElementById('adm-name').value;
    const email = document.getElementById('adm-email').value;
    const dob = document.getElementById('adm-dob').value;
    const gender = document.getElementById('adm-gender').value;
    const selectedClass = document.getElementById('adm-class').value;
    const parentName = document.getElementById('adm-parent').value;
    const phone = document.getElementById('adm-phone').value;
    const address = document.getElementById('adm-address').value;
    const school = document.getElementById('adm-school').value;

    if (!name || !email || !dob || !parentName || !phone) { 
      showToast('Please fill all required fields', 'error'); 
      return; 
    }
    
    // Dynamically captures the current system calendar year (e.g., 2026, 2027, etc.)
    const currentYear = new Date().getFullYear();
    
    // Automatically uses the correct year format based on submission time
    const appId = `VID-${currentYear}-` + Math.floor(1000 + Math.random() * 9000);
    
    // Create the structured application object
    const newApplication = {
      id: appId,
      name,
      email,
      dob,
      gender,
      class: selectedClass,
      parentName,
      phone,
      address,
      school,
      status: 'Pending', // Controlled by the Admin Dashboard later
      submissionDate: new Date().toLocaleDateString()
    };

    // Save to localStorage so your Admin Dashboard can read this data immediately
    const existingApplications = JSON.parse(localStorage.getItem('schoolApplications')) || [];
    existingApplications.push(newApplication);
    localStorage.setItem('schoolApplications', JSON.stringify(existingApplications));

    // UI Updates to show success screen
    document.getElementById('appIdDisplay').textContent = appId;
    document.getElementById('admissionFormSection').classList.add('hidden');
    document.getElementById('admissionSuccess').classList.remove('hidden');
    window.scrollTo(0, 400);
    
    showToast('Application submitted successfully!', 'success');
  }

  // Fallback for banner headers to stay accurate dynamically
  const displayYear = new Date().getFullYear();
  const nextYearShort = String(displayYear + 1).slice(-2);

  return (
    <div className="page" id="page-admission">
      <div className="page-hero">
        <h1 className="page-hero-title">Online Admissions {displayYear}–{nextYearShort}</h1>
        <p className="page-hero-sub">Begin your child's journey with Indian Springs School, Apply Now.</p>
      </div>
      <section className="section section-alt" id="admissionFormSection">
        <div className="container">
          <div className="admission-form-card">
            <div className="section-eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>Step 1 of 1 — Application Form</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.3rem' }}>Student Application</h2>
            <p className="text-muted text-sm mb-3">All fields marked are required for processing your application.</p>
            <div className="form-section-title">Student Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Student Full Name *</label><input className="form-input" id="adm-name" placeholder="As per birth certificate" /></div>
              <div className="form-group"><label className="form-label">Date of Birth *</label><input className="form-input" type="date" id="adm-dob" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Gender *</label>
                <select className="form-select" id="adm-gender">
                  <option>Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Applying for Class *</label>
                <select className="form-select" id="adm-class">
                  <option>Select Class</option>
                 <option>Class 6</option><option>Class 7</option><option>Class 8</option>
                  <option>Class 9</option><option>Class 10</option>
                 
                </select>
              </div>
            </div>
            <div className="form-section-title">Parent / Guardian Information</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Parent / Guardian Name *</label><input className="form-input" id="adm-parent" placeholder="Full name" /></div>
              <div className="form-group"><label className="form-label">Relationship *</label>
                <select className="form-select"><option>Father</option><option>Mother</option><option>Guardian</option></select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" id="adm-email" placeholder="parent@email.com" /></div>
              <div className="form-group"><label className="form-label">Phone Number *</label><input className="form-input" type="tel" id="adm-phone" placeholder="+91 98765 43210" /></div>
            </div>
            <div className="form-group"><label className="form-label">Residential Address *</label><textarea className="form-textarea" style={{ minHeight: '80px' }} id="adm-address" placeholder="Full address with PIN code"></textarea></div>
            <div className="form-section-title">Academic Background</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Previous School *</label><input className="form-input" id="adm-school" placeholder="School name" /></div>
              <div className="form-group"><label className="form-label">Last Grade / Percentage</label><input className="form-input" placeholder="e.g., 92%" /></div>
            </div>
            <div className="form-section-title">Documents Upload</div>
            <div className="gallery-upload-zone" onClick={() => showToast('Document upload ready for backend integration', '')}>
              <div className="upload-icon">📁</div>
              <div className="upload-text">Click to upload documents</div>
              <div className="upload-hint">Birth Certificate, Previous Marksheet, Passport Photo (PDF / JPG, max 5MB each)</div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn-submit" onClick={submitAdmission}>Submit Application</button>
              <button className="btn-secondary" onClick={() => navigate('home')}>Cancel</button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section section-alt hidden" id="admissionSuccess">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Application Submitted!</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>Your application has been received. We'll contact you within 3–5 working days.</p>
            <div>Application ID</div>
            <div className="app-id" id="appIdDisplay">VID-{displayYear}-XXXX</div>
            <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>Please save this ID for future reference and correspondence.</p>
            <button className="btn-submit" onClick={() => navigate('home')}>Back to Home</button>
          </div>
        </div>
      </section>
    </div>
  );
}