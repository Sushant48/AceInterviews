import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },
        userAnswer: { type: String },
      },
    ],
    interviewFeedback: {
      overallScore: {
        type: Number,
        default: 0,
      },
      strengths: {
        type: [String], 
        default: [],
      },
      weaknesses: {
        type: [String], 
        default: [],
      },
      comments: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Interview = mongoose.model("Interview", interviewSchema);
