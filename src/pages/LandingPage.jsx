import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to QuizMeAnything</h1>
      <p>Test your knowledge on any topic powered by AI!</p>
      <button onClick={() => navigate('/quiz')}>Start Quiz</button>
    </div>
  );
};

export default LandingPage;
