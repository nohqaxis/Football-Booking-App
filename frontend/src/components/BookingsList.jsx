import React, { useState } from 'react';
import axios from 'axios';
import './BookingsList.css';

const API_URL = '/api';

function BookingsList({ bookings, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setDeletingId(bookingId);
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`);
      onRefresh();
    } catch (err) {
      alert('Failed to delete booking. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (bookings.length === 0) {
    return (
      <div className="bookings-list">
        <h2>My Bookings</h2>
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <p>Start by browsing our available pitches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-list">
      <h2>My Bookings</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <div className="booking-header-card">
              <h3>{booking.pitch_name}</h3>
              <span className="booking-status">Confirmed</span>
            </div>
            <div className="booking-details">
              <div className="booking-detail-item">
                <span className="detail-label">📍 Location:</span>
                <span className="detail-value">{booking.pitch_location}</span>
              </div>
              <div className="booking-detail-item">
                <span className="detail-label">📅 Date:</span>
                <span className="detail-value">{formatDate(booking.booking_date)}</span>
              </div>
              <div className="booking-detail-item">
                <span className="detail-label">🕐 Time:</span>
                <span className="detail-value">
                  {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </span>
              </div>
              <div className="booking-detail-item">
                <span className="detail-label">👤 Name:</span>
                <span className="detail-value">{booking.customer_name}</span>
              </div>
              <div className="booking-detail-item">
                <span className="detail-label">📧 Email:</span>
                <span className="detail-value">{booking.customer_email}</span>
              </div>
              <div className="booking-detail-item">
                <span className="detail-label">📞 Phone:</span>
                <span className="detail-value">{booking.customer_phone}</span>
              </div>
              <div className="booking-detail-item price-item">
                <span className="detail-label">💰 Total:</span>
                <span className="detail-value price">${parseFloat(booking.total_price).toFixed(2)}</span>
              </div>
            </div>
            <div className="booking-actions">
              <button
                onClick={() => handleDelete(booking.id)}
                disabled={deletingId === booking.id}
                className="cancel-booking-button"
              >
                {deletingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsList;

