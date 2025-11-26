import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const q = query(collection(db, "classrooms"), where("teacherId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const classes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClassrooms(classes);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      await addDoc(collection(db, "classrooms"), {
        name: newClassName,
        teacherId: currentUser.uid,
        createdAt: new Date()
      });
      setNewClassName('');
      fetchClassrooms();
    } catch (error) {
      console.error("Error creating classroom:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="user-info">
          <span>{currentUser.email}</span>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="create-class-section card-glass">
          <h3>Create New Classroom</h3>
          <form onSubmit={handleCreateClassroom} className="create-class-form">
            <input 
              type="text" 
              value={newClassName} 
              onChange={(e) => setNewClassName(e.target.value)} 
              placeholder="Class Name (e.g., 5th Grade Science)"
              required
            />
            <button type="submit" className="primary-btn">Create Class</button>
          </form>
        </div>

        <div className="classrooms-grid">
          {loading ? (
            <p>Loading classrooms...</p>
          ) : classrooms.length === 0 ? (
            <p>No classrooms found. Create one to get started!</p>
          ) : (
            classrooms.map(classroom => (
              <Link to={`/teacher/classroom/${classroom.id}`} key={classroom.id} className="classroom-card card-glass">
                <h3>{classroom.name}</h3>
                <p>View Tests & Results →</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
