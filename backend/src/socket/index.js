import { Server } from "socket.io";
import { Interview } from "../models/interview.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateNextInterviewQuestion } from "../utils/generateNextInterviewQuestion.js";
import { generateInterviewFeedback } from "../utils/generateInterviewFeedback.js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const setupInterviewSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinInterview", async ({ interviewId, userId }) => {
      socket.join(interviewId);
      console.log(`User ${userId} joined interview ${interviewId}`);

      const interview = await Interview.findById(interviewId);

      // // Notify that the interview is starting soon (5 minutes before)
      // setTimeout(() => {
      //   io.to(interviewId).emit("interviewStartingSoon", {
      //     message: "Your interview is starting soon!",
      //   });
      // }, 300000);

      const fques = interview.questions[0];
      console.log(
        "📤 Emitting first question to room:",
        interview._id,
        "Question:",
        fques
      );

      setTimeout(() => {
        io.to(interviewId).emit("realTimeInterviewStarted", { fques });
      }, 1000);
    });

    socket.on("sendAnswer", async ({ interviewId, questionId, answer }) => {
      try {
        const interview = await Interview.findById(interviewId);
        if (!interview) throw new ApiError(403, "Interview not found");

        const question = interview.questions.id(questionId);
        if (!question) throw new ApiError(404, "Question not found");

        // Save user answer
        question.userAnswer = answer;
        await interview.save();

        // Emit received answer
        io.to(interviewId).emit("receiveAnswer", { questionId, answer });

        // ✅ AI Feedback - Using Stream for efficiency
        const feedbackPrompt = `Evaluate this answer for a ${interview.jobTitle} interview: "${answer}"`;
        const feedbackStream = await genAI
          .getGenerativeModel({ model: "gemini-2.0-flash" })
          .generateContentStream(feedbackPrompt);

        let feedback = "";
        for await (const chunk of feedbackStream.stream) {
          if (chunk.text()) {
            feedback += chunk.text();

            // Emit partial feedback live for real-time updates
            io.to(interviewId).emit("liveFeedback", { message: feedback });
          }
        }

        // Save AI feedback
        question.aiFeedback = feedback;
        await interview.save();

        // Emit live feedback
        io.to(interviewId).emit("liveFeedback", { message: feedback });

        // ✅ Generate Next Question (Using Updated Data)
        const updatedInterview = await Interview.findById(interviewId);
        const nextQuestion = await generateNextInterviewQuestion(
          updatedInterview
        );

        if (nextQuestion) {
          const newQuestion = { question: nextQuestion };
          updatedInterview.questions.push(newQuestion);
          await updatedInterview.save();

          io.to(interviewId).emit("nextQuestion", {
            question: nextQuestion,
            id: updatedInterview.questions[
              updatedInterview.questions.length - 1
            ]._id,
          });
        } else {
          // Mark interview as completed
          updatedInterview.status = "completed";
          await updatedInterview.save();
          io.to(interviewId).emit("interviewCompleted", {
            message: "Interview completed successfully!",
          });
        }
      } catch (error) {
        console.error(error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("endInterview", async ({ interviewId }) => {
      try {
        const interview = await Interview.findOne({
          _id: interviewId
        }).populate("resume");

        if (!interview) throw new ApiError(403, "Interview not found");

        const feedback = await generateInterviewFeedback(
          interview.questions,
          interview.resume.resumeTxt
        );

        interview.interviewFeedback = feedback;
        interview.status = "completed";
        await interview.save();

        // Notify all users
        io.to(interviewId).emit("interviewCompleted", feedback);
      } catch (error) {
        console.error(error);
        socket.emit("error", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export { setupInterviewSocket };
