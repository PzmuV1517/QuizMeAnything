import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QuizForm from '../components/QuizForm';
import QuizGame from '../components/QuizGame';
import { generateQuestions } from '../api/gemini';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  useEffect(() => {
    const topic = searchParams.get('topic');
    const grade = searchParams.get('grade');
    const numQuestions = searchParams.get('numQuestions');

    if (topic && grade && numQuestions && !gameStarted && !loading) {
        handleStartQuiz(topic, grade, parseInt(numQuestions));
    }
  }, [searchParams]);

  const handleReset = () => {
    setGameStarted(false);
    setQuestions([]);
    setError(null);
    setSearchParams({}); // Clear URL params on reset
  };

  return (
    <div className="quiz-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to Home
      </button>

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
