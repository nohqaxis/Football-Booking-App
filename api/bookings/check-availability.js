import { db } from '../database.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { pitchId, date, startTime, endTime } = req.body;

      if (!pitchId || !date || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const overlapping = db.checkAvailability(pitchId, date, startTime, endTime);
      res.status(200).json({ available: overlapping.length === 0, conflictingBookings: overlapping });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

