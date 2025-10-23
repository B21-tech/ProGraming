// routes/testRoutes.js
import express from "express";
import { getStageQuestions } from "../controllers/questionController.js";


const router = express.Router();

// get /api/questions/:stageId
router.get("/:stageId", getStageQuestions);

export default router;
