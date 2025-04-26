import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateFirstInterviewQuestion = async (jobTitle, resumeText) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        I am conducting a real-time interview for a job position of "${jobTitle}". 
        The candidate has uploaded their resume with the following details:

        ${resumeText}

        Based on this, generate a highly relevant first interview question.
        The question should be technical and role-specific.
        Output only the question.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating first question:", error);
        return "Tell me about yourself.";
    }
};