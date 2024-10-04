import { GEMINI_MODEL } from "@/constants";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const gemini = genAI.getGenerativeModel({ 
  model: GEMINI_MODEL,
  generationConfig: { responseMimeType: "application/json" }
});
