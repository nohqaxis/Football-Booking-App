import { db } from './database.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const bookings = db.getAllBookings();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
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
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

