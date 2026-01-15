## QuizMeAnything

QuizMeAnything is an AI‑powered quiz generator and classroom tool built with React, Vite, Firebase, and Google’s Gemini API.

It lets anyone instantly generate multiple‑choice or true/false quizzes on any topic, and gives teachers a way to create classes, share tests with students, and track results.

### Core Features

- **AI Quiz Generation** – Uses Gemini (gemini-2.5-flash) to generate topic‑specific questions with answer options and correct answers.
- **On‑Demand Quizzes** – From the landing page, anyone can create and play a quick quiz via the Quiz Me flow.
- **Teacher Portal**  
  - Email/password auth with Firebase Authentication.  
  - Teacher dashboard for managing classrooms.  
  - Per‑class test creation with configurable topic, grade level, number of questions, type, and tone.  
  - Shareable links for students to take a specific test.
- **Student Experience** – Students open a shared link, enter their name, complete the quiz, and see their score.
- **Results & Analytics** – Teachers can view a table of student scores for each test.

### Tech Stack

- **Frontend:** React + Vite
- **Styling:** Custom CSS (glassmorphism‑style UI)
- **Routing:** react-router-dom
- **Backend Services:** Firebase Authentication and Firestore
- **AI:** @google/generative-ai (Gemini API)

### Getting Started

1. **Install dependencies**

	```bash
	npm install
	```

2. **Configure environment variables**

	Create a `.env` file based on `.env.example` and set your Gemini API key:

	```env
	VITE_GEMINI_API_KEY=your_gemini_api_key_here
	```

	Make sure the key has quota for the `gemini-2.5-flash` model in Google AI Studio / Cloud.

3. **Firebase configuration**

	The Firebase project configuration is defined in `src/firebase.js`. Update it if you want to connect to your own Firebase project (Auth + Firestore).

4. **Run the app in development**

	```bash
	npm run dev
	```

	Then open the URL printed in the terminal (usually http://localhost:5173).

### Key Flows

- **Quick Quiz (no login)**  
  1. Go to the landing page and click “Quiz Me”.  
  2. Enter topic, difficulty, and other options.  
  3. The app calls Gemini to generate questions and starts the quiz.

- **Teacher Workflow**  
  1. Register or log in via the Teacher Portal.  
  2. Create a classroom from the Teacher Dashboard.  
  3. Inside a classroom, create a new test (topic, grade, question count, type, tone).  
  4. Copy the generated test link and share it with students.  
  5. Students complete the quiz; results are saved to Firestore and shown in the classroom view.

### Notes

- This project is intended as a learning/demo app for combining React, Firebase, and the Gemini API in an educational context.
