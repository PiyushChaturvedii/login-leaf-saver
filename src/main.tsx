
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { mongoConfig } from './config/mongodb.ts'

// Log MongoDB configuration at startup (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('MongoDB config loaded', { apiUrl: mongoConfig.apiUrl });
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
