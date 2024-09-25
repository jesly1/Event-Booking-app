import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';
import AuthContext from '../../context/auth-context'; 

const MainNavigation = () => {
  const authContext = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Easy Event</h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!authContext.token && ( // Only show "Authentication" link if the user is not logged in
            <li>
              <NavLink to="/auth">Authentication</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {authContext.token && ( // Only show "Bookings" link and Logout button if the user is authenticated
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={authContext.logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
