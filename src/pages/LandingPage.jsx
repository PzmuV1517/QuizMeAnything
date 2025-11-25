import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <button className="mini-quiz-btn" onClick={() => navigate('/quiz')}>Quiz Me</button>
      <h1>Welcome to QuizMeAnything</h1>
      <p className="subtitle">The ultimate AI-powered quiz generator. Test your knowledge on absolutely any topic imaginable.</p>
      
      <div className="features-grid">
        <div className="feature-card">
          <h3>🤖 AI-Powered</h3>
          <p>Powered by Google's Gemini AI to generate unique and accurate questions instantly.</p>
        </div>
        <div className="feature-card">
          <h3>📚 Any Topic</h3>
          <p>From Quantum Physics to 90s Pop Music, if you can name it, we can quiz you on it.</p>
        </div>
        <div className="feature-card">
          <h3>🎓 Adjustable Level</h3>
          <p>Set the difficulty from "5th Grade" to "PhD Expert" to match your learning level.</p>
        </div>
        <div className="feature-card">
          <h3>🔗 Easy Sharing</h3>
          <p>Teachers can generate custom quizzes and share a direct link with students instantly.</p>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <p>Enter any topic you want to learn about</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Select your preferred difficulty level</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Challenge yourself and master the subject!</p>
          </div>
        </div>
      </div>

      <button className="primary-btn" onClick={() => navigate('/quiz')}>Start Quiz</button>
    </div>
  );
};

export default LandingPage;
