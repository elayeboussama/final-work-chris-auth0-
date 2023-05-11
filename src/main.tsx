import React from 'react';
import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-5lnfbck0axa5rkdw.us.auth0.com"
    clientId="9zt6IZVQ8rtQtNa2T9XIcIs6lctxUP0V"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <React.StrictMode>
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>
);

