import React, { useState } from 'react';

const QuizForm = ({ onStartQuiz, loading }) => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartQuiz(topic, grade, numQuestions);
  };

  return (
    <div className="quiz-form-container card-glass">
      <h2>Setup Your Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            placeholder="e.g., World History, Quantum Physics, 90s Pop Music"
          />
        </div>
        <div className="form-group">
          <label htmlFor="grade">Difficulty / Grade Level:</label>
          <input
            type="text"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            placeholder="e.g., 5th Grade, High School, PhD, Expert"
          />
        </div>
        <div className="form-group">
          <label htmlFor="numQuestions">Number of Questions:</label>
          <input
            type="number"
            id="numQuestions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || '')}
            min="1"
            max="20"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="start-btn">
          {loading ? 'Generating Questions...' : 'Quiz Me'}
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
