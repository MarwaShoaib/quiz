import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Radio } from '@mui/material';
const Home = () => {
  const navigate = useNavigate();

  const handleQuizManagementClick = () => {
    navigate('/quiz-management');
  };

  const handleQuizRoomClick = () => {
    navigate('/quiz-room');
  };

  return (
    <div>
      <h1>Welcome to the Quiz System</h1>
      <div>
        <Button variant='contained' onClick={handleQuizManagementClick}>
          Quiz Management
        </Button>
        <Button
          variant='contained'
          color='info'
          onClick={handleQuizRoomClick}
        >
          Quiz Room
        </Button>
      </div>
    </div>
  );
};

export default Home;