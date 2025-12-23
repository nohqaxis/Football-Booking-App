# ⚽ Football Pitch Booking App

A modern, full-stack web application for booking football pitches. Built with React, Express, and SQLite.

## Features

- 🏟️ Browse available football pitches with details and pricing
- 📅 Select date and time slots for bookings
- ✅ Real-time availability checking
- 💳 Automatic price calculation based on duration
- 📋 View and manage all bookings
- 🎨 Beautiful, responsive UI with modern design
- 🔒 Prevents double bookings with conflict detection

## Tech Stack

### Frontend
- React 18
- Vite
- Axios for API calls
- Modern CSS with gradients and animations

### Backend
- Node.js with Express
- SQLite database (better-sqlite3)
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Football-Booking-App
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server** (from the `backend` directory)
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server** (from the `frontend` directory)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to use the application

## Project Structure

```
Football-Booking-App/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── bookings.db        # SQLite database (created automatically)
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── PitchList.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── BookingsList.jsx
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
└── README.md
```

## API Endpoints

### Pitches
- `GET /api/pitches` - Get all pitches
- `GET /api/pitches/:id` - Get a specific pitch

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/pitch/:pitchId/date/:date` - Get bookings for a pitch on a specific date
- `POST /api/bookings/check-availability` - Check if a time slot is available
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:id` - Delete a booking

## Usage

1. **Browse Pitches**: View all available football pitches with their details and pricing
2. **Select a Pitch**: Click "Book Now" on any pitch to start the booking process
3. **Fill Booking Form**: Enter your details, select date and time
4. **Check Availability**: Click "Check Availability" to verify the time slot is free
5. **Confirm Booking**: Review the total price and confirm your booking
6. **View Bookings**: Navigate to "My Bookings" to see all your reservations

## Database Schema

### Pitches Table
- `id` - Primary key
- `name` - Pitch name
- `location` - Pitch location
- `price_per_hour` - Hourly rate
- `image_url` - Pitch image URL
- `description` - Pitch description

### Bookings Table
- `id` - Primary key
- `pitch_id` - Foreign key to pitches
- `customer_name` - Customer's full name
- `customer_email` - Customer's email
- `customer_phone` - Customer's phone number
- `booking_date` - Date of booking
- `start_time` - Start time (HH:MM format)
- `end_time` - End time (HH:MM format)
- `total_price` - Calculated total price
- `created_at` - Timestamp of booking creation

## Features in Detail

### Availability Checking
The system prevents double bookings by checking for overlapping time slots:
- Validates that end time is after start time
- Checks for any existing bookings that overlap with the requested time
- Provides real-time feedback on availability

### Price Calculation
- Automatically calculates total price based on:
  - Duration (difference between start and end time)
  - Pitch's hourly rate
- Displays price preview before confirmation

### Validation
- Email format validation
- Required field validation
- Date validation (cannot book in the past)
- Time logic validation

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with auto-reload using --watch
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot module replacement
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

**Backend:**
```bash
cd backend
npm start
```

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is already in use:
- Backend: Set `PORT` environment variable (e.g., `PORT=3002 npm start`)
- Frontend: Modify `vite.config.js` port setting

### Database Issues
If you encounter database errors:
- Delete `backend/bookings.db` and restart the server (it will recreate automatically)
- Ensure write permissions in the backend directory

## License

This project is open source and available for educational purposes.

## Future Enhancements

- User authentication and accounts
- Payment integration
- Email notifications
- Calendar view for bookings
- Recurring bookings
- Admin dashboard
- Pitch ratings and reviews
