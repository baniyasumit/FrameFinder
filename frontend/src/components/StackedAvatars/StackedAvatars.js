import React from 'react';
import './StackedAvatars.css';

const StackedAvatars = ({ avatars }) => {
  const maxVisible = 3; // how many to map dynamically
  const visibleAvatars = avatars.slice(0, maxVisible);

  return (
    <div className="avatar-stack">
      {visibleAvatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
          className="avatar"
          style={{ left: `${index * 12}px`, zIndex: 100 + index }}
        />
      ))}

      {/* Manual last one (can be +10, +10K, +1M, etc.) */}
      <div
        className="avatar overflow-avatar"
        style={{ left: `${visibleAvatars.length * 12}px`, zIndex: 104 }}
      >
        +10K
      </div>
    </div>
  );
};

export default StackedAvatars;
