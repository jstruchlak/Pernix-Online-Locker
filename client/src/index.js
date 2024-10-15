import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DetailsContextProvider } from './context/DetailsContext';
import { AuthContextProvider } from './context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* AuthContext parent to detailsContext */}
    <AuthContextProvider>
      {/* detailsContext parent to <App /> */}
      <DetailsContextProvider>
        <App />
      </DetailsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);