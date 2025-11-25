import React, { useState } from 'react';

const QuizForm = ({ onStartQuiz, loading }) => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [tone, setTone] = useState('standard');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartQuiz(topic, grade, numQuestions, questionType, tone);
  };

  const handleShare = () => {
    if (!topic || !grade || !numQuestions) {
        alert("Please fill in all fields to generate a link.");
        return;
    }
    const url = `${window.location.origin}/quiz?topic=${encodeURIComponent(topic)}&grade=${encodeURIComponent(grade)}&numQuestions=${numQuestions}&type=${questionType}&tone=${tone}`;
    setShareUrl(url);
    setShowShareModal(true);
    setCopySuccess(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <>
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
        <div className="form-group">
          <label htmlFor="questionType">Question Type:</label>
          <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True / False</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tone">Tone / Style:</label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="humorous">Humorous / Fun</option>
            <option value="sarcastic">Sarcastic</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="pirate">Pirate Speak</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="start-btn">
          {loading ? 'Generating Questions...' : 'Quiz Me'}
        </button>
        
        <button type="button" onClick={handleShare} className="share-btn" disabled={loading}>
            Share Quiz Link
        </button>
      </form>
    </div>

    {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content card-glass">
            <h3>Share Quiz</h3>
            <p>Send this link to your students:</p>
            <div className="url-box">
                <input type="text" value={shareUrl} readOnly />
                <button onClick={copyToClipboard} className="copy-btn">
                    {copySuccess ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <button onClick={() => setShowShareModal(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuizForm;
