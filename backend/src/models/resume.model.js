import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeFileUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number, // ATS score out of 100
      default: 0,
    },
    atsStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    keywordsMatched: {
      type: [String], // Keywords matched during ATS analysis
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model("Resume", resumeSchema);
