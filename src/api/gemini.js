import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestions = async (topic, grade, numQuestions, userApiKey) => {
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please provide it in the form or set VITE_GEMINI_API_KEY in .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Generate ${numQuestions} multiple choice questions about "${topic}" suitable for a "${grade}" level. 
  Return the response strictly as a valid JSON array of objects. 
  Each object must have the following structure:
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The correct option text (must match one of the options exactly)"
  }
  Do not include any markdown formatting like \`\`\`json or \`\`\`. Just the raw JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown code blocks if the model ignores the instruction
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const questions = JSON.parse(cleanedText);
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. " + error.message);
  }
};
