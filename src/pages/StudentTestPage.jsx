import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import QuizGame from '../components/QuizGame';

const StudentTestPage = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testDoc = await getDoc(doc(db, "tests", testId));
        if (testDoc.exists()) {
          setTest({ id: testDoc.id, ...testDoc.data() });
        } else {
          setError("Test not found.");
        }
      } catch (err) {
        setError("Error loading test.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  const handleStart = (e) => {
    e.preventDefault();
    if (studentName.trim()) {
      setStarted(true);
    }
  };

  const handleComplete = async (score, totalQuestions) => {
    try {
      await addDoc(collection(db, "results"), {
        testId,
        studentName,
        score,
        totalQuestions,
        createdAt: new Date()
      });
      setCompleted(true);
    } catch (err) {
      console.error("Error saving results:", err);
      alert("Failed to save results. Please try again.");
    }
  };

  if (loading) return <div className="loading">Loading test...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (!started) {
    return (
      <div className="student-test-page">
        <div className="card-glass welcome-card">
          <h1>{test.topic} Quiz</h1>
          <p>Grade: {test.grade} • {test.numQuestions} Questions</p>
          <form onSubmit={handleStart} className="name-form">
            <div className="form-group">
              <label>Enter your full name to begin:</label>
              <input 
                type="text" 
                value={studentName} 
                onChange={(e) => setStudentName(e.target.value)} 
                required 
                placeholder="John Doe"
              />
            </div>
            <button type="submit" className="primary-btn">Start Quiz</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="student-test-page">
      <QuizGame 
        questions={test.questions} 
        onReset={() => window.location.reload()} 
        onComplete={handleComplete}
      />
    </div>
  );
};

export default StudentTestPage;
