import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// ⬇️ IMPORT THIS
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ⬇️ WRAP APP IN BROWSERROUTER HERE */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);