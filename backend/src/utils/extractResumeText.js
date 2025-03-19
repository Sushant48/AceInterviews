import fs from "fs";
import PdfParse from "pdf-parse";
import mammoth from "mammoth";
import { ApiError } from "./ApiError.js";

// Function to extract text from a PDF
const extractTextFromPDF = async (filePath) => {
  try {   
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await PdfParse(dataBuffer);

    return pdfData.text;
  } catch (error) {
    console.error("Error extracting resume text:", error);
    throw error;
  }
};

// Function to extract text from a DOCX file
const extractTextFromDOCX = async (filePath) => {
  const { value } = await mammoth.extractRawText({ path: filePath });
  return value;
};

// Function to determine file type and extract text
const extractResumeText = async (filePath, fileType) => {
  if (fileType === "application/pdf") {
    return await extractTextFromPDF(filePath);
  } else if (fileType === "docx") {
    return await extractTextFromDOCX(filePath);
  } else {
    throw new ApiError(401,"Unsupported file type");
  }
};

export default extractResumeText;
