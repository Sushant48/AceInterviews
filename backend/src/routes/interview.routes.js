import { Router } from "express";
import {
    startInterview,
    submitAnswer,
    completeInterview,
    getInterviewHistory,
    getInterviewDetails,
    getPerformanceMetrics,
    deleteInterview,
    startRealtimeInterview
} from '../controllers/interview.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/startInterview").post(verifyJWT, startInterview);
router.route("/submitAnswer").post(verifyJWT, submitAnswer);
router.route("/completeInterview").post(verifyJWT, completeInterview);
router.route("/performance-metrics").get(verifyJWT, getPerformanceMetrics);

router.get('/history', verifyJWT, getInterviewHistory);
router.get('/:id', verifyJWT, getInterviewDetails);

router.delete('/:id', verifyJWT, deleteInterview);


router.route("/start-realtime").post(verifyJWT, startRealtimeInterview);

export default router;