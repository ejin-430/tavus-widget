import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CVIProvider } from './components/cvi/components/cvi-provider';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CVIProvider>
      <App />
    </CVIProvider>
  </React.StrictMode>
);
