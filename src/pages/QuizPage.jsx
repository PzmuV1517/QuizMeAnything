import React, { useState } from 'react';
import QuizForm from '../components/QuizForm';
import QuizGame from '../components/QuizGame';
import { generateQuestions } from '../api/gemini';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartQuiz = async (topic, grade, numQuestions) => {
    setLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateQuestions(topic, grade, numQuestions);
      setQuestions(generatedQuestions);
      setGameStarted(true);
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGameStarted(false);
    setQuestions([]);
    setError(null);
  };

  return (
    <div className="quiz-page">
      {error && <div className="error-message">{error}</div>}
      
      {!gameStarted ? (
        <QuizForm onStartQuiz={handleStartQuiz} loading={loading} />
      ) : (
        <QuizGame questions={questions} onReset={handleReset} />
      )}
    </div>
  );
};

export default QuizPage;
