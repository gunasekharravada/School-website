import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize default page after mount
setTimeout(() => {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const home = document.getElementById('page-home');
  if (home) home.classList.add('active');
}, 0);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
