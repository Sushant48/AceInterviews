import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateInterviewFeedback = async (questions, resumeTxt) => {
  try {
    const prompt = `Analyze the following interview responses based on the resume provided here: ${resumeTxt}. 
    Provide an objective assessment including an overall score (out of 100), strengths, weaknesses, and additional comments.
    
    Questions and answers:
    ${questions.map((q, index) => `Q${index + 1}: ${q.question}\nA${index + 1}: ${q.userAnswer || "Not answered"}`).join("\n")}

    Format the response strictly as JSON like this:
    {
      "overallScore": <number>,
      "strengths": [<string>],
      "weaknesses": [<string>],
      "comments": "<string>"
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const feedback = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);

    return feedback;
  } catch (error) {
    console.error("Error generating interview feedback:", error);
    throw new Error("Failed to generate interview feedback");
  }
};
