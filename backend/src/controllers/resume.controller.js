import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generateATSScore = async (resumeFileUrl, jobTitle) => {
  if (!resumeFileUrl || !jobTitle) {
      throw new ApiError(400, "Resume file URL and job title are required");
  }

  const prompt = `You are an ATS (Applicant Tracking System) evaluator. Given a resume and a job title, evaluate the resume's compatibility for the job and provide an ATS score between 0 and 100.

  Job Title: ${jobTitle}
  Resume URL: ${resumeFileUrl}

  Please respond in JSON format like this:
  {
    "atsScore": <number>
  }`;

  try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{.*\}/s);
      const parsedResponse = jsonMatch ? JSON.parse(jsonMatch) : null;


      if (!parsedResponse.atsScore || isNaN(parsedResponse.atsScore)) {
          throw new ApiError(500, "Invalid response from AI model");
      }

      return parsedResponse.atsScore;
  } catch (error) {
      console.error("Error generating ATS score:", error);
      throw new ApiError(500, error.message || "Failed to generate ATS score");
  }
};


const uploadResume = asyncHandler(async (req, res) => {

  const { jobTitle } = req.body;

    if (!req.file) {
        throw new ApiError(400, "Resume file is required");
    }

    const { originalname: fileName, mimetype: fileType, path: localPath } = req.file;

    
    const uploadedFile = await uploadOnCloudinary(localPath);

    if (!uploadedFile?.url) {
        throw new ApiError(500, "Failed to upload resume to Cloudinary");
    }

    const atsScore = await generateATSScore(uploadedFile.url , jobTitle);

    const resume = await Resume.create({
        user: req.user._id,
        resumeFileUrl: uploadedFile.url,
        fileName,
        fileType,
        atsScore
    });

    return res.status(201).json(
        new ApiResponse(201, resume, "Resume uploaded successfully")
    );
});


const getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ uploadDate: -1 });

  if (!resumes.length) {
    throw new ApiError(404, "No resumes found for the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
});


const deleteResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  if (!resumeId) {
    throw new ApiError(400, "Resume ID is required");
  }

  const deletedResume = await Resume.findOneAndDelete({
    _id: resumeId,
    user: req.user._id,
  });

  if (!deletedResume) {
    throw new ApiError(404, "Resume not found or unauthorized action");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedResume, "Resume deleted successfully"));
});


const getResumeById = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  if (!resumeId) {
    throw new ApiError(400, "Resume ID is required");
  }

  const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

  if (!resume) {
    throw new ApiError(404, "Resume not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume fetched successfully"));
});

export {
  uploadResume,
  getUserResumes,
  deleteResume,
  getResumeById
};