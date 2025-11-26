import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { generateQuestions } from '../api/gemini';

const ClassroomPage = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [tests, setTests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [tone, setTone] = useState('standard');
  const [creating, setCreating] = useState(false);
  const [createdTestId, setCreatedTestId] = useState(null);

  // Results View
  const [selectedTest, setSelectedTest] = useState(null);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    fetchClassroomData();
  }, [classroomId]);

  const fetchClassroomData = async () => {
    try {
      const classDoc = await getDoc(doc(db, "classrooms", classroomId));
      if (classDoc.exists()) {
        setClassroom({ id: classDoc.id, ...classDoc.data() });
        
        // Fetch tests
        const q = query(collection(db, "tests"), where("classroomId", "==", classroomId), orderBy("createdAt", "desc"));
        const testsSnapshot = await getDocs(q);
        setTests(testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else {
        navigate('/teacher/dashboard');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // 1. Generate Questions
      const questions = await generateQuestions(topic, grade, numQuestions, questionType, tone);
      
      // 2. Save to Firestore
      const docRef = await addDoc(collection(db, "tests"), {
        classroomId,
        topic,
        grade,
        numQuestions,
        questionType,
        tone,
        questions,
        createdAt: new Date()
      });

      // 3. Reset and Refresh
      setCreatedTestId(docRef.id);
      setTopic('');
      setGrade('');
      fetchClassroomData();
    } catch (error) {
      alert("Failed to create test: " + error.message);
      setShowCreateModal(false);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreatedTestId(null);
  };

  const handleViewResults = async (test) => {
    setSelectedTest(test);
    try {
      const q = query(collection(db, "results"), where("testId", "==", test.id), orderBy("createdAt", "desc"));
      const resultsSnapshot = await getDocs(q);
      setTestResults(resultsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const copyTestLink = (testId) => {
    const url = `${window.location.origin}/test/${testId}`;
    navigator.clipboard.writeText(url);
    alert("Test link copied! Share it with your students.");
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="classroom-page">
      <header className="dashboard-header">
        <button onClick={() => navigate('/teacher/dashboard')} className="back-btn-nav">← Dashboard</button>
        <h1>{classroom?.name}</h1>
      </header>

      <div className="classroom-content">
        <div className="actions-bar">
          <button onClick={() => setShowCreateModal(true)} className="primary-btn">Create New Test</button>
        </div>

        <div className="tests-list">
          <h2>Class Tests</h2>
          {tests.length === 0 ? (
            <p>No tests created yet.</p>
          ) : (
            <div className="tests-grid">
              {tests.map(test => (
                <div key={test.id} className="test-card card-glass">
                  <h3>{test.topic}</h3>
                  <p className="test-meta">{test.grade} • {test.numQuestions} Questions</p>
                  <div className="test-actions">
                    <button onClick={() => copyTestLink(test.id)} className="action-btn">Copy Link</button>
                    <button onClick={() => handleViewResults(test)} className="action-btn secondary">View Results</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTest && (
          <div className="results-section card-glass" id="results">
            <div className="results-header">
              <h2>Results: {selectedTest.topic}</h2>
              <button onClick={() => setSelectedTest(null)} className="close-btn">Close</button>
            </div>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {testResults.length === 0 ? (
                  <tr><td colSpan="3">No results yet.</td></tr>
                ) : (
                  testResults.map(result => (
                    <tr key={result.id}>
                      <td>{result.studentName}</td>
                      <td>{result.score} / {result.totalQuestions}</td>
                      <td>{result.createdAt?.toDate().toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content card-glass">
            {createdTestId ? (
              <div className="success-message">
                <h3>Test Created Successfully!</h3>
                <p>Share this link with your students:</p>
                <div className="link-box">
                  <input 
                    type="text" 
                    readOnly 
                    value={`${window.location.origin}/test/${createdTestId}`} 
                  />
                  <button onClick={() => copyTestLink(createdTestId)} className="primary-btn">Copy</button>
                </div>
                <button onClick={handleCloseModal} className="close-btn-full">Done</button>
              </div>
            ) : (
              <>
                <h3>Create New Test</h3>
                <form onSubmit={handleCreateTest}>
                  <div className="form-group">
                    <label>Topic</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Grade Level</label>
                    <input type="text" value={grade} onChange={e => setGrade(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Number of Questions</label>
                    <input type="number" value={numQuestions} onChange={e => setNumQuestions(e.target.value)} min="1" max="20" required />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={questionType} onChange={e => setQuestionType(e.target.value)}>
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tone</label>
                    <select value={tone} onChange={e => setTone(e.target.value)}>
                      <option value="standard">Standard</option>
                      <option value="humorous">Humorous</option>
                      <option value="sarcastic">Sarcastic</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="pirate">Pirate</option>
                    </select>
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
                    <button type="submit" className="primary-btn" disabled={creating}>
                      {creating ? 'Creating...' : 'Create Test'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomPage;
