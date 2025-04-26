import { Interview } from "../models/interview.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateNextInterviewQuestion = async (interviewId) => {
    try {
        const interview = await Interview.findById(interviewId).populate('resume');
        if (!interview) throw new Error("Interview not found");

        const { jobTitle, questions, resume } = interview;
        const resumeText = resume ? resume.resumeTxt || "No resume text available." : "No resume provided.";

        // ✅ Fix: Use `q.question` instead of `q.text`
        const pastConversation = questions.map((q, index) => `
        Q${index + 1}: ${q.question}  
        A${index + 1}: ${q.userAnswer || "No answer yet"}
        `).join("\n");

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // ✅ Optimized prompt for better AI understanding
        const prompt = `
        You are an interviewer for a ${jobTitle} role.
        
        **Candidate's Resume Summary:**
        ${resumeText}
        
        **Previous Q&A:**
        ${pastConversation}

        Based on the job role and the past conversation, generate a relevant **next interview question** that:
        - Is technical or behavioral based on past answers
        - Matches the job requirements
        - Feels like a natural next step in the interview

        ONLY output the next question. Do NOT include explanations.
        `;

        // ✅ Use generateContentStream() for better performance
        const Stream = await model.generateContentStream(prompt);

        let nextQuestion = "";
        for await (const chunk of Stream.stream) {
            if (chunk.text()) {
              nextQuestion += chunk.text();
            }
          }

        return nextQuestion.trim();
    } catch (error) {
        console.error("Error generating next question:", error);
        return "Can you share more details about your experience?";
    }
};
