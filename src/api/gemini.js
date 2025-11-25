import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestions = async (topic, grade, numQuestions, questionType, tone, userApiKey) => {
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please provide it in the form or set VITE_GEMINI_API_KEY in .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const typeDescription = questionType === 'mixed' ? 'mixed multiple choice and true/false' : questionType;
  const optionsInstruction = questionType === 'true-false' 
    ? '["True", "False"]' 
    : '["Option A", "Option B", "Option C", "Option D"] (or ["True", "False"] if it is a True/False question)';

  const prompt = `Generate ${numQuestions} ${typeDescription} questions about "${topic}" suitable for a "${grade}" level. 
  The tone of the questions should be ${tone}.
  Return the response strictly as a valid JSON array of objects. 
  Each object must have the following structure:
  {
    "question": "The question text",
    "options": ${optionsInstruction},
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
