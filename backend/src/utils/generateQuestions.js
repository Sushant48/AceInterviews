import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateInterviewQuestions = async (resumeFileUrl, jobTitle) => {
  try {
    const prompt = `You are an expert technical interviewer. Given the resume provided at this URL: ${resumeFileUrl}, generate a clear, well-structured list of interview questions tailored specifically for the job title: ${jobTitle}. 

Please categorize the questions into two sections:

1. 5 Technical Questions (related to skills, technologies, and projects mentioned in the resume)
2. 5 Behavioral Questions (based on work experience, teamwork, problem-solving, and ownership)

Please respond in single JSON format like this(don't mention category names):
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
    console.log(parsedResponse);
    
    
    const questions = parsedResponse.question;

    return questions;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions");
  }
};
