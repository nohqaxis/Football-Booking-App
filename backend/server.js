import express from 'express';
import cors from 'cors';
import { db } from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all pitches
app.get('/api/pitches', (req, res) => {
  try {
    const pitches = db.getAllPitches();
    res.json(pitches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific pitch
app.get('/api/pitches/:id', (req, res) => {
  try {
    const pitch = db.getPitchById(req.params.id);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }
    res.json(pitch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = db.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings for a specific pitch and date
app.get('/api/bookings/pitch/:pitchId/date/:date', (req, res) => {
  try {
    const bookings = db.getBookingsByPitchAndDate(req.params.pitchId, req.params.date);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check availability
app.post('/api/bookings/check-availability', (req, res) => {
  try {
    const { pitchId, date, startTime, endTime } = req.body;

    if (!pitchId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const overlapping = db.checkAvailability(pitchId, date, startTime, endTime);
    res.json({ available: overlapping.length === 0, conflictingBookings: overlapping });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new booking
app.post('/api/bookings', (req, res) => {
  try {
    const { pitchId, customerName, customerEmail, customerPhone, bookingDate, startTime, endTime } = req.body;

    // Validate required fields
    if (!pitchId || !customerName || !customerEmail || !customerPhone || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate time format and logic
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    // Check availability
    const overlapping = db.checkAvailability(pitchId, bookingDate, startTime, endTime);
    if (overlapping.length > 0) {
      return res.status(409).json({ error: 'Time slot is already booked' });
    }

    // Get pitch price
    const pitch = db.getPitchById(pitchId);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    // Calculate duration and total price
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const durationHours = (end - start) / (1000 * 60 * 60);
    const totalPrice = durationHours * pitch.price_per_hour;

    // Create booking
    const booking = db.createBooking({
      pitch_id: parseInt(pitchId),
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
      total_price: totalPrice
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const deleted = db.deleteBooking(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
