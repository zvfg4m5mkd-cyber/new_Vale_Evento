import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL(`${import.meta.env.BASE_URL}service-worker.js`, window.location.href);
    navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL })
      .catch((error) => {
        console.warn('PWA service worker registration failed:', error);
      });
  });
}
