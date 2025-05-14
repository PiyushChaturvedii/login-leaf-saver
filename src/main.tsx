
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { mongoConfig } from './config/mongodb.ts'

// Log MongoDB configuration at startup
console.log('MongoDB configuration loaded');
console.log('MongoDB URI: ', mongoConfig.uri.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, 'mongodb+srv://$1:****@'));
console.log('API URL: ', mongoConfig.apiUrl);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
