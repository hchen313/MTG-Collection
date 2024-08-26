import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!); // Create a root and pass the container elemen 

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
); 