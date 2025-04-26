import { Interview } from "../models/interview.model.js";
import { Resume } from "../models/resume.model.js";
import { generateInterviewQuestions } from "../utils/generateQuestions.js";
import { generateFirstInterviewQuestion } from "../utils/generateFirstInterviewQuestion.js"
import { generateInterviewFeedback } from "../utils/generateInterviewFeedback.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const startInterview = asyncHandler(async (req, res) => {
  const { resumeId, jobTitle } = req.body;

  if (!resumeId || !jobTitle) {
    throw new ApiError(400, "Resume ID and job title are required");
  }

  const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  const questions = await generateInterviewQuestions(resume.resumeTxt, jobTitle);

  const interview = await Interview.create({
    user: req.user._id,
    resume: resumeId,
    title: jobTitle,
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
  
    const feedback = await generateInterviewFeedback(interview.questions, interview.resume.resumeTxt);
  
    interview.interviewFeedback = feedback;
    interview.status = "completed";
    await interview.save();
  
    return res.status(200).json(new ApiResponse(200, feedback, "Interview completed and feedback generated successfully"));
  });


const getInterviewHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 5, status, date, sort, resumeId } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  
  const filter = { user: userId };
  if (status) filter.status = status;
  if (date) filter.createdAt = { $gte: new Date(date) };
  if (resumeId) filter.resume = resumeId;
  
  const totalInterviews = await Interview.countDocuments(filter);
  
  const interviews = await Interview.find(filter)
    .populate('resume', 'fileName')
    .sort(sort === 'desc' ? '-createdAt' : 'createdAt')
    .skip(skip)
    .limit(limitNum);
  
  const totalPages = Math.ceil(totalInterviews / limitNum);
  
  res.status(200).json(new ApiResponse(
    200, 
    {
      data: interviews,
      pagination: {
        total: totalInterviews,
        currentPage: pageNum,
        totalPages,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }, 
    "Interview history retrieved successfully"
  ));
  });

const getInterviewDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const interview = await Interview.findById(id)
      .populate("user", "name email")
      .populate("resume", "fileName resumeFileUrl")
      .exec();
  
    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }
   
    if (interview.user._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to access this interview");
    }
  
    res.status(200).json(new ApiResponse(200, interview, "Interview details fetched successfully"));
  });

const getPerformanceMetrics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
  
    const interviews = await Interview.find({ user: userId });
  
    if (!interviews.length) {
      throw new ApiError(404, "No interview data found for this user");
    }
  
    const totalInterviews = interviews.length;
  
    const scores = interviews
      .map((interview) => interview.interviewFeedback.overallScore)
      .filter((score) => score !== null && score !== undefined);
  
    const averageScore = scores.length
      ? scores.reduce((acc, score) => acc + score, 0) / scores.length
      : 0;
  
    const extractKeywords = (sentence) => {
      return sentence
        .toLowerCase()
        .match(/\b\w+\b/g)
        .filter((word) => word.length > 3);
    };
  
    const groupSimilarPhrases = (phrases) => {
      const frequency = {};
  
      phrases.forEach((phrase) => {
        const keywords = extractKeywords(phrase).join(" ");
        frequency[keywords] = (frequency[keywords] || 0) + 1;
      });
  
      return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .map(([phrase]) => phrase)
        .slice(0, 5);
    };
  
    const strengths = interviews.flatMap((interview) => interview.interviewFeedback.strengths);
    const weaknesses = interviews.flatMap((interview) => interview.interviewFeedback.weaknesses);
  
    const topStrengths = groupSimilarPhrases(strengths);
    const topWeaknesses = groupSimilarPhrases(weaknesses);
  
    const performanceTrend = interviews
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((interview) => interview.interviewFeedback.overallScore)
      .filter((score) => score !== null && score !== undefined);
  
    const metrics = {
      totalInterviews,
      averageScore: averageScore.toFixed(2),
      topStrengths,
      topWeaknesses,
      performanceTrend,
    };
  
    res.status(200).json(new ApiResponse(200, metrics, "Performance metrics fetched successfully"));
  });

const deleteInterview = asyncHandler(async (req, res) => {
    const { id: interviewId } = req.params;
  
    const interview = await Interview.findById(interviewId);
  
    if (!interview) {
      throw new ApiError(404, "Interview not found");
    }
  
    if (interview.user._id.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this interview");
    }
  
    await interview.deleteOne();
  
    res.status(200).json(new ApiResponse(200, null, "Interview deleted successfully"));
  });


  const startRealtimeInterview = asyncHandler(async (req, res) => {
    const { resumeId, jobTitle } = req.body;

    if (!resumeId || !jobTitle) {
        throw new ApiError(400, "Resume ID and job title are required");
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    const firstQuestion = await generateFirstInterviewQuestion(jobTitle, resume.resumeTxt);

    const interview = await Interview.create({
        user: req.user._id,
        resume: resumeId,
        jobTitle,
        questions: [{ question: firstQuestion }],
        status: "in-progress",
        sessionType: "real-time",
    });
  
    res.status(200).json(new ApiResponse(200, { interviewId: interview._id }, "Real-time interview session initialized"));
});


export {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewDetails,
  getPerformanceMetrics,
  deleteInterview,
  startRealtimeInterview
};