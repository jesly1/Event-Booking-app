import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

function App() {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ token, userId, login, logout }}>
        <MainNavigation />
        <main className="main-content">
          <Routes>
            {/* Redirect logic based on token */}
            <Route path="/" element={token ? <Navigate to="/events" />:<Navigate to="/auth"/>} />
            <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/events"/>} />
            <Route path="/events" element={<Events /> } />
            <Route path="/bookings" element={token ? <Bookings /> : <Navigate to="/auth"/>} />
          </Routes>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
