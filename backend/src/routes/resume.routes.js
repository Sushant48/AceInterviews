import { Router } from "express";
import {
  uploadResume,
  getUserResumes,
  deleteResume,
  getResumeById,
} from "../controllers/resume.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/uploadResume")
  .post(verifyJWT, upload.single("Resume"), uploadResume);
router.route("/getUserResumes").get(verifyJWT, getUserResumes);
router.get("/deleteResume/:resumeId" , verifyJWT, deleteResume);
router.get("/getResumeById/:resumeId" , verifyJWT , getResumeById);

export default router;