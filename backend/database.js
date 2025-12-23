import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'database.json');

// Initialize database structure
const initDB = () => {
  if (!existsSync(DB_PATH)) {
    const initialData = {
      pitches: [],
      bookings: [],
      nextPitchId: 1,
      nextBookingId: 1
    };
    writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(readFileSync(DB_PATH, 'utf8'));
};

// Read database
const readDB = () => {
  return JSON.parse(readFileSync(DB_PATH, 'utf8'));
};

// Write database
const writeDB = (data) => {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Database operations
export const db = {
  // Pitches
  getAllPitches: () => {
    const data = readDB();
    return data.pitches.sort((a, b) => a.name.localeCompare(b.name));
  },

  getPitchById: (id) => {
    const data = readDB();
    return data.pitches.find(p => p.id === parseInt(id));
  },

  createPitch: (pitch) => {
    const data = readDB();
    const newPitch = {
      id: data.nextPitchId++,
      ...pitch
    };
    data.pitches.push(newPitch);
    writeDB(data);
    return newPitch;
  },

  // Bookings
  getAllBookings: () => {
    const data = readDB();
    return data.bookings.map(booking => {
      const pitch = data.pitches.find(p => p.id === booking.pitch_id);
      return {
        ...booking,
        pitch_name: pitch?.name || 'Unknown',
        pitch_location: pitch?.location || 'Unknown'
      };
    }).sort((a, b) => {
      const dateCompare = b.booking_date.localeCompare(a.booking_date);
      if (dateCompare !== 0) return dateCompare;
      return b.start_time.localeCompare(a.start_time);
    });
  },

  getBookingsByPitchAndDate: (pitchId, date) => {
    const data = readDB();
    return data.bookings
      .filter(b => b.pitch_id === parseInt(pitchId) && b.booking_date === date)
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
  },

  checkAvailability: (pitchId, date, startTime, endTime) => {
    const data = readDB();
    const overlapping = data.bookings.filter(booking => {
      if (booking.pitch_id !== parseInt(pitchId) || booking.booking_date !== date) {
        return false;
      }
      // Check for overlap
      return (
        (booking.start_time < startTime && booking.end_time > startTime) ||
        (booking.start_time < endTime && booking.end_time > endTime) ||
        (booking.start_time >= startTime && booking.end_time <= endTime)
      );
    });
    return overlapping;
  },

  createBooking: (booking) => {
    const data = readDB();
    const newBooking = {
      id: data.nextBookingId++,
      ...booking,
      created_at: new Date().toISOString()
    };
    data.bookings.push(newBooking);
    writeDB(data);
    
    // Return booking with pitch details
    const pitch = data.pitches.find(p => p.id === newBooking.pitch_id);
    return {
      ...newBooking,
      pitch_name: pitch?.name || 'Unknown',
      pitch_location: pitch?.location || 'Unknown'
    };
  },

  deleteBooking: (id) => {
    const data = readDB();
    const index = data.bookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) {
      return false;
    }
    data.bookings.splice(index, 1);
    writeDB(data);
    return true;
  }
};

// Seed initial data if database is empty
const data = initDB();
if (data.pitches.length === 0) {
  const pitches = [
    {
      name: 'Main Pitch',
      location: 'Sports Complex A',
      price_per_hour: 50,
      image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
      description: 'Professional-grade football pitch with artificial turf, perfect for matches and training.'
    },
    {
      name: 'Training Pitch',
      location: 'Sports Complex A',
      price_per_hour: 35,
      image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      description: 'Smaller training pitch ideal for practice sessions and small-sided games.'
    },
    {
      name: 'Community Pitch',
      location: 'Community Center',
      price_per_hour: 25,
      image_url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800',
      description: 'Affordable community pitch with natural grass, great for casual games.'
    },
    {
      name: 'Elite Pitch',
      location: 'Elite Sports Academy',
      price_per_hour: 75,
      image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      description: 'Premium pitch with floodlights, changing rooms, and professional facilities.'
    }
  ];

  pitches.forEach(pitch => {
    db.createPitch(pitch);
  });
}

