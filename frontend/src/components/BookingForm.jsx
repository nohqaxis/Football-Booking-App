import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';

const API_URL = '/api';

function BookingForm({ pitch, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    startTime: '',
    endTime: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear availability status when date/time changes
    if (name === 'bookingDate' || name === 'startTime' || name === 'endTime') {
      setAvailabilityStatus(null);
    }
  };

  const checkAvailability = async () => {
    if (!formData.bookingDate || !formData.startTime || !formData.endTime) {
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setAvailabilityStatus({ available: false, message: 'End time must be after start time' });
      return;
    }

    setCheckingAvailability(true);
    try {
      const response = await axios.post(`${API_URL}/bookings/check-availability`, {
        pitchId: pitch.id,
        date: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      if (response.data.available) {
        setAvailabilityStatus({ available: true, message: 'Time slot is available!' });
      } else {
        setAvailabilityStatus({ 
          available: false, 
          message: 'This time slot is already booked. Please choose another time.' 
        });
      }
    } catch (err) {
      setAvailabilityStatus({ available: false, message: 'Error checking availability' });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const calculatePrice = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(`2000-01-01 ${formData.startTime}`);
    const end = new Date(`2000-01-01 ${formData.endTime}`);
    const durationHours = (end - start) / (1000 * 60 * 60);
    return (durationHours * pitch.price_per_hour).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Booking date is required';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.bookingDate = 'Cannot book in the past';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!availabilityStatus || !availabilityStatus.available) {
      alert('Please check availability first and ensure the time slot is available');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/bookings`, {
        pitchId: pitch.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime
      });

      onSuccess();
    } catch (err) {
      if (err.response?.status === 409) {
        alert('This time slot has been booked by someone else. Please choose another time.');
        setAvailabilityStatus(null);
      } else {
        alert('Failed to create booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <button className="back-button" onClick={onCancel}>
          ← Back
        </button>
        <h2>Book {pitch.name}</h2>
        <p className="pitch-location">📍 {pitch.location}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="customerName">Full Name *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="John Doe"
            className={errors.customerName ? 'error' : ''}
          />
          {errors.customerName && <span className="error-message">{errors.customerName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="customerEmail">Email *</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="john@example.com"
            className={errors.customerEmail ? 'error' : ''}
          />
          {errors.customerEmail && <span className="error-message">{errors.customerEmail}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="customerPhone">Phone Number *</label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="+1234567890"
            className={errors.customerPhone ? 'error' : ''}
          />
          {errors.customerPhone && <span className="error-message">{errors.customerPhone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="bookingDate">Booking Date *</label>
          <input
            type="date"
            id="bookingDate"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={errors.bookingDate ? 'error' : ''}
          />
          {errors.bookingDate && <span className="error-message">{errors.bookingDate}</span>}
        </div>

        <div className="time-group">
          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={errors.startTime ? 'error' : ''}
            />
            {errors.startTime && <span className="error-message">{errors.startTime}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className={errors.endTime ? 'error' : ''}
            />
            {errors.endTime && <span className="error-message">{errors.endTime}</span>}
          </div>
        </div>

        {formData.startTime && formData.endTime && (
          <div className="price-preview">
            <strong>Total Price: ${calculatePrice()}</strong>
            <span className="price-note">({((new Date(`2000-01-01 ${formData.endTime}`) - new Date(`2000-01-01 ${formData.startTime}`)) / (1000 * 60 * 60)).toFixed(1)} hours × ${pitch.price_per_hour}/hour)</span>
          </div>
        )}

        {formData.bookingDate && formData.startTime && formData.endTime && (
          <div className="availability-check">
            <button
              type="button"
              onClick={checkAvailability}
              disabled={checkingAvailability || formData.startTime >= formData.endTime}
              className="check-availability-button"
            >
              {checkingAvailability ? 'Checking...' : 'Check Availability'}
            </button>
            {availabilityStatus && (
              <div className={`availability-status ${availabilityStatus.available ? 'available' : 'unavailable'}`}>
                {availabilityStatus.message}
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !availabilityStatus || !availabilityStatus.available}
            className="submit-button"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;

