import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateInterviewQuestions = async (resumeTxt, jobTitle) => {
  
  try {
    const prompt = `You are an expert technical interviewer. Given the resume: ${resumeTxt}, generate a clear, well-structured list of 10 interview questions from the given resume and tailored for the job title: ${jobTitle}. 

Please respond in single JSON format like this:
  {
    "question" : ["question1 text",
                  "question2 text",
                  "question3 text",
                  "question4 text",
                  "question5 text",
                  "question6 text",
                  "question7 text",
                  "question8 text",
                  "question9 text",
                  "question10 text"]
  }`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{.*\}/s);
    const parsedResponse = jsonMatch ? JSON.parse(jsonMatch) : null;
    
    const questions = parsedResponse.question;

    return questions;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};
