import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0B1F4A',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '8px',
          },
          success: { iconTheme: { primary: '#F5C842', secondary: '#0B1F4A' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
