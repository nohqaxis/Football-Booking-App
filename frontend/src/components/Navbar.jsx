import React from 'react';
import './Navbar.css';

function Navbar({ currentView, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">⚽</span>
          <span className="brand-text">PitchBook</span>
        </div>
        <div className="navbar-menu">
          <button
            className={`nav-link ${currentView === 'pitches' ? 'active' : ''}`}
            onClick={() => onNavigate('pitches')}
          >
            <span className="nav-icon">🏟️</span>
            <span className="nav-text">Browse Pitches</span>
          </button>
          <button
            className={`nav-link ${currentView === 'bookings' ? 'active' : ''}`}
            onClick={() => onNavigate('bookings')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">My Bookings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

