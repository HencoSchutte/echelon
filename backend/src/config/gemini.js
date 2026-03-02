import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // safe to call again; does nothing if already loaded

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0",
});

console.log("Gemini Key:", process.env.GEMINI_API_KEY);

export default model;
