import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseconfig'; // Adjust this path based on where your firebase config file lives
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './EventsPage.css';

export default function EventsPage({ navigate }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Query the 'events' collection, ordered by date if available
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('date', 'asc')); 
        const querySnapshot = await getDocs(q);
        
        const fetchedEvents = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Handle Firestore Timestamp formatting cleanly
          let day = "00";
          let month = "Jan";
          if (data.date) {
            const dateObj = data.date.toDate ? data.date.toDate() : new Date(data.date);
            day = dateObj.getDate();
            month = dateObj.toLocaleString('en-US', { month: 'short' });
          }

          return {
            id: doc.id,
            day: day,
            month: month,
            tag: data.tag || 'Event',
            title: data.title || 'Untitled Event',
            desc: data.desc || 'No description provided.'
          };
        });

        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="page" id="page-events">
      <div className="page-hero">
        <h1 className="page-hero-title">Events &amp; Calendar</h1>
        <p className="page-hero-sub">Stay connected with what's happening at India Springs School.</p>
      </div>
      
      <section className="section section-alt">
        <div className="container">
          
          {loading ? (
            <div className="loading-state">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="empty-state">No upcoming events found.</div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div className="event-card" key={event.id}>
                  <div className="event-date-bar">
                    <div>
                      <div className="event-day">{event.day}</div>
                      <div className="event-month">{event.month}</div>
                    </div>
                    <span>{event.tag}</span>
                  </div>
                  <div className="event-info">
                    <div className="event-title">{event.title}</div>
                    <div className="event-desc">{event.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
      
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button className="btn-secondary" onClick={() => navigate('home')}>← Back to Home</button>
      </div>
    </div>
  );
}