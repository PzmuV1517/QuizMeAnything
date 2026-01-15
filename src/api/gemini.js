import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestions = async (topic, grade, numQuestions, questionType, tone, userApiKey) => {
  const apiKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please provide it in the form or set VITE_GEMINI_API_KEY in .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let typeDescription = questionType;
  let optionsInstruction = '';

  if (questionType === 'true-false') {
    typeDescription = 'True/False';
    optionsInstruction = '["True", "False"]';
  } else if (questionType === 'mixed') {
    typeDescription = 'mixed Multiple Choice and True/False';
    optionsInstruction = '["Option A", "Option B", "Option C", "Option D"] for multiple choice or ["True", "False"] for true/false';
  } else {
    // multiple-choice
    typeDescription = 'Multiple Choice (with 4 options)';
    optionsInstruction = '["Option A", "Option B", "Option C", "Option D"]';
  }

  const prompt = `Generate ${numQuestions} ${typeDescription} questions about "${topic}" suitable for a "${grade}" level. 
  The tone of the questions should be ${tone}.
  Return the response strictly as a valid JSON array of objects. 
  Each object must have the following structure:
  {
    "question": "The question text",
    "options": ${optionsInstruction},
    "correctAnswer": "The correct option text (must match one of the options exactly)"
  }
  IMPORTANT: If the type is Multiple Choice, you MUST provide exactly 4 options. Do not use True/False unless the type is explicitly True/False or Mixed.
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
