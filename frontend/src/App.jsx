import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import PitchList from './components/PitchList';
import BookingForm from './components/BookingForm';
import BookingsList from './components/BookingsList';

const API_URL = '/api';

function App() {
  const [pitches, setPitches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [showBookings, setShowBookings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPitches();
    fetchBookings();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await axios.get(`${API_URL}/pitches`);
      setPitches(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load pitches');
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookings`);
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handlePitchSelect = (pitch) => {
    setSelectedPitch(pitch);
    setShowBookings(false);
  };

  const handleBookingSuccess = () => {
    fetchBookings();
    setSelectedPitch(null);
    alert('Booking created successfully!');
  };

  const handleBack = () => {
    setSelectedPitch(null);
    setShowBookings(false);
  };

  const handleNavigate = (view) => {
    if (view === 'pitches') {
      setSelectedPitch(null);
      setShowBookings(false);
    } else if (view === 'bookings') {
      setShowBookings(true);
      setSelectedPitch(null);
      fetchBookings();
    }
  };

  const getCurrentView = () => {
    if (showBookings) return 'bookings';
    return 'pitches';
  };

  if (loading) {
    return (
      <div className="app-wrapper">
        <Navbar currentView="pitches" onNavigate={handleNavigate} />
        <div className="app-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-wrapper">
        <Navbar currentView="pitches" onNavigate={handleNavigate} />
        <div className="app-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Navbar 
        currentView={getCurrentView()}
        onNavigate={handleNavigate}
      />
      
      <div className="app-container">
        {!selectedPitch && !showBookings && (
          <header className="app-header">
            <div className="header-content">
              <h1 className="header-title">
                Find Your Perfect
                <span className="title-highlight"> Football Pitch</span>
              </h1>
              <p className="header-subtitle">
                Book premium football pitches in minutes. Choose from our selection of professional and community fields.
              </p>
            </div>
          </header>
        )}

        <main className="app-main">
          {showBookings ? (
            <BookingsList bookings={bookings} onRefresh={fetchBookings} />
          ) : selectedPitch ? (
            <BookingForm
              pitch={selectedPitch}
              onSuccess={handleBookingSuccess}
              onCancel={handleBack}
            />
          ) : (
            <PitchList pitches={pitches} onSelectPitch={handlePitchSelect} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;

