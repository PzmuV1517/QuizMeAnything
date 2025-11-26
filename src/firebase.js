import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDQpEkeXlrqlbrmfpxkTjSmmzfCGxjQ7w",
  authDomain: "quizzmeanything.firebaseapp.com",
  projectId: "quizzmeanything",
  storageBucket: "quizzmeanything.firebasestorage.app",
  messagingSenderId: "422424641448",
  appId: "1:422424641448:web:94f4e28f26041ed0ff679d",
  measurementId: "G-WNLJ2M05QT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
