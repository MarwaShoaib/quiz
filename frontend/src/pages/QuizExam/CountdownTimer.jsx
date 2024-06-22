import React, { useState, useEffect } from 'react';

function CountdownTimer({ minutesLeft, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(minutesLeft * 60); // Convert minutes to seconds
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(prevTime => prevTime - 1);
      } else {
        setIsExpired(true);
        clearInterval(interval);
        if (typeof onTimeUp === 'function') {
          onTimeUp(); // Call the callback function
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [timeLeft, onTimeUp]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {isExpired ? (
        <p style={{color: 'red'}}>Time's up!</p>
      ) : (
        <p>Time left: {formatTime(timeLeft)}</p>
      )}
    </div>
  );
}

export default CountdownTimer;
