import React from 'react';
import './PitchList.css';

function PitchList({ pitches, onSelectPitch }) {
  return (
    <div className="pitch-list">
      <h2>Available Pitches</h2>
      <div className="pitches-grid">
        {pitches.map((pitch) => (
          <div key={pitch.id} className="pitch-card">
            <div className="pitch-image">
              <img src={pitch.image_url} alt={pitch.name} />
            </div>
            <div className="pitch-info">
              <h3>{pitch.name}</h3>
              <p className="pitch-location">📍 {pitch.location}</p>
              <p className="pitch-description">{pitch.description}</p>
              <div className="pitch-footer">
                <span className="pitch-price">${pitch.price_per_hour}/hour</span>
                <button
                  className="book-button"
                  onClick={() => onSelectPitch(pitch)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PitchList;

