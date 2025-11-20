import React, { useState } from 'react';

const QuizGame = ({ questions, onReset }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (option) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      setShowScore(true);
    }
  };
  
  const checkAnswer = () => {
      setIsAnswerChecked(true);
      if (selectedAnswer === currentQuestion.correctAnswer) {
          setScore(prev => prev + 1);
      }
  }
  
  const nextAfterCheck = () => {
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestionIndex(nextQuestion);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
      } else {
        setShowScore(true);
      }
  }

  if (showScore) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="score-section card-glass">
        <h2>Quiz Completed!</h2>
        <div className="score-circle" style={{ '--score-percent': `${percentage}%` }}>
            <div className="score-text">{score}/{questions.length}</div>
        </div>
        <p className="score-message">
            {percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Learning!'}
        </p>
        <button onClick={onReset} className="primary-btn">Play Again</button>
      </div>
    );
  }

  return (
    <div className="quiz-game card-glass">
      <div className="question-section">
        <div className="question-header">
            <div className="question-count">
            Question <span>{currentQuestionIndex + 1}</span>/{questions.length}
            </div>
            <div className="score-badge">Score: {score}</div>
        </div>
        <div className="question-text">{currentQuestion.question}</div>
      </div>
      <div className="answer-section">
        {currentQuestion.options.map((option, index) => {
            let className = "answer-btn";
            if (isAnswerChecked) {
                if (option === currentQuestion.correctAnswer) {
                    className += " correct";
                } else if (option === selectedAnswer) {
                    className += " incorrect";
                }
            } else if (selectedAnswer === option) {
                className += " selected";
            }
            
            return (
                <button 
                    key={index} 
                    onClick={() => handleAnswerClick(option)}
                    className={className}
                    disabled={isAnswerChecked}
                >
                    {option}
                </button>
            );
        })}
      </div>
      <div className="controls">
          {!isAnswerChecked ? (
              <button onClick={checkAnswer} disabled={!selectedAnswer} className="control-btn">
                  Submit Answer
              </button>
          ) : (
              <button onClick={nextAfterCheck} className="control-btn">
                  {currentQuestionIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
              </button>
          )}
      </div>
    </div>
  );
};

export default QuizGame;
