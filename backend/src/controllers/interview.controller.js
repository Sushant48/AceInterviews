import { Interview } from "../models/interview.model.js";
import { Resume } from "../models/resume.model.js";
import { generateInterviewQuestions } from "../utils/generateQuestions.js";
import { generateInterviewFeedback } from "../utils/generateInterviewFeedback.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Start a new mock interview
const startInterview = asyncHandler(async (req, res) => {
  const { resumeId, jobTitle } = req.body;

  if (!resumeId || !jobTitle) {
    throw new ApiError(400, "Resume ID and job title are required");
  }

  const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const questions = await generateInterviewQuestions(resume.resumeFileUrl, jobTitle);

  const interview = await Interview.create({
    user: req.user._id,
    resume: resumeId,
    questions: questions.map((q) => ({ question: q })),
  });

  return res.status(201).json(new ApiResponse(201, interview, "Interview started successfully"));
});

const submitAnswer = asyncHandler(async (req, res) => {
    const { interviewId, questionId, userAnswer } = req.body;
  
    if (!interviewId || !questionId || !userAnswer) {
      throw new ApiError(400, "Interview ID, question ID, and user answer are required");
    }
  
    const interview = await Interview.findOne({ _id: interviewId, user: req.user._id });
  
    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }
  
    const question = interview.questions.id(questionId);
  
    if (!question) {
      throw new ApiError(404, "Question not found");
    }
  
    question.userAnswer = userAnswer;
    await interview.save();
  
    return res.status(200).json(new ApiResponse(200, question, "Answer submitted successfully"));
  });

  const completeInterview = asyncHandler(async (req, res) => {
    const { interviewId } = req.body;
  
    if (!interviewId) {
      throw new ApiError(400, "Interview ID is required");
    }
  
    const interview = await Interview.findOne({ _id: interviewId, user: req.user._id }).populate("resume");
  
    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }
  
    const feedback = await generateInterviewFeedback(interview.questions, interview.resume.resumeFileUrl);
  
    interview.interviewFeedback = feedback;
    await interview.save();
  
    return res.status(200).json(new ApiResponse(200, feedback, "Interview completed and feedback generated successfully"));
  });


export {
  startInterview,
  submitAnswer,
  completeInterview
};