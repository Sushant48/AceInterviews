import { Router } from "express";
import {
    startInterview,
    submitAnswer,
    completeInterview
} from '../controllers/interview.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/startInterview").post(verifyJWT, startInterview);
router.route("/submitAnswer").post(verifyJWT, submitAnswer);
router.route("/completeInterview").post(verifyJWT, completeInterview);


export default router;