# Vidyalaya — Smart School Management System

A fully separated React + CSS project converted from a single HTML file.

---

## Project Structure

```
vidyalaya/
├── index.html                          # HTML entry point (Google Fonts loaded here)
├── package.json                        # React + Vite dependencies
├── vite.config.js                      # Vite configuration
└── src/
    ├── index.jsx                       # React root mount
    ├── App.jsx                         # Root component — navigation logic + page assembly
    ├── global.css                      # Design tokens, reset, shared utilities & components
    └── components/
        ├── Navbar.jsx                  # Top navigation bar with login dropdown
        ├── Navbar.css
        ├── Sidebar.css                 # Shared sidebar styles (used by all dashboards)
        └── pages/
            ├── HomePage.jsx            # Hero, Achievements, Announcements, Events,
            ├── HomePage.css            #   Testimonials, Gallery Preview, Footer
            ├── AboutPage.jsx           # About + Values grid
            ├── AboutPage.css
            ├── AcademicsPage.jsx       # Classes & Streams
            ├── AcademicsPage.css
            ├── EventsPage.jsx          # Full events listing
            ├── EventsPage.css
            ├── GalleryPage.jsx         # Filterable photo gallery
            ├── GalleryPage.css
            ├── ContactPage.jsx         # Contact info + feedback + message form
            ├── ContactPage.css
            ├── AdmissionPage.jsx       # Admission form + success screen
            ├── AdmissionPage.css
            ├── AuthPages.jsx           # Student / Teacher / Parent / Admin login pages
            ├── AuthPages.css
            └── dashboards/
                ├── StudentDashboard.jsx   # Home, Materials, Papers, Quiz,
                ├── StudentDashboard.css   #   Announcements, Calendar, Chat, Feedback
                ├── TeacherDashboard.jsx   # Home, Classes, Upload, Quiz Builder,
                ├── TeacherDashboard.css   #   Students, Announcements, Events, Feedback
                ├── ParentDashboard.jsx    # Home, Attendance, Results, Homework,
                ├── ParentDashboard.css    #   Teacher Feedback, Announcements, Events
                ├── AdminDashboard.jsx     # Home, Students, Teachers, Admissions,
                └── AdminDashboard.css     #   Notices, Events, Gallery, Settings
```

---

## CSS Architecture

| File | Contains |
|---|---|
| `global.css` | CSS variables (tokens), reset, section/card/button/form/table/badge/progress/toast shared styles |
| `Navbar.css` | Sticky navbar, login dropdown, hamburger menu, responsive breakpoints |
| `Sidebar.css` | Dashboard sidebar used by all 4 role dashboards |
| `HomePage.css` | Hero section, stats, testimonials, gallery grid preview, footer |
| `AboutPage.css` | About grid, image placeholder, values grid |
| `GalleryPage.css` | Category filter buttons, full gallery grid |
| `ContactPage.css` | Contact grid, info card, form card |
| `AdmissionPage.css` | Form card, success card, app-id display |
| `AuthPages.css` | Auth page layout, container, role badges, login button |
| `StudentDashboard.css` | Subject tabs, material list, quiz UI, score display, chat UI |
| `TeacherDashboard.css` | Class cards, student management cards, attendance bars |
| `ParentDashboard.css` | Child profile card, result cards, grade colours |
| `AdminDashboard.css` | Admin stat cards, admission app cards, event form card |

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## Navigation Flow

```
Home Page
  ├── About
  ├── Academics
  ├── Admissions (form → success)
  ├── Events
  ├── Gallery (filterable)
  ├── Contact (feedback + message)
  └── Login (dropdown)
        ├── Student Login  →  Student Dashboard
        │     (Materials, Papers, Quiz, Calendar, Chat, Feedback)
        ├── Teacher Login  →  Teacher Dashboard
        │     (Classes, Upload, Quiz Builder, Students, Notices)
        ├── Parent Login   →  Parent Dashboard
        │     (Attendance, Results, Homework, Teacher Feedback)
        └── Admin Login    →  Admin Dashboard
              (Students, Teachers, Admissions, Notices, Events, Gallery, Settings)
```

---

## Notes

- No inline CSS used — all styles are in `.css` files.
- Original code logic is preserved exactly — no additions or removals.
- Fully responsive: mobile nav hamburger, stacked grids, sidebar collapses on small screens.
- `navigate()` and `showToast()` are defined in `App.jsx` and passed as props.
- `Sidebar.css` is imported directly inside each dashboard component file.
