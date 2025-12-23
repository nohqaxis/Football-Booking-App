#!/bin/bash

echo "Starting Football Booking App..."
echo ""
echo "Starting Backend Server..."
cd backend
npm install
npm start &
BACKEND_PID=$!
cd ..

sleep 3

echo ""
echo "Starting Frontend Server..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
wait

