import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DetailsContextProvider } from './context/DetailsContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DetailsContextProvider>
      <App />
    </DetailsContextProvider>
  </React.StrictMode>
);


