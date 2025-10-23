// routes/stageRoutes.js
import express from "express";
import Stage from "../models/Stage.js";
import Question from "../models/Question.js";
import { getStagesByCourse } from "../controllers/progressController.js";

const router = express.Router();

// fetch the previous stage and 5 random questions from it
router.get("/:stageId/skip-questions", async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.stageId);
    if (!stage) return res.status(404).json({ error: "Stage not found" });

    // Find previous stage
    const previousStage = await Stage.findOne({
      level: stage.level,
      order: stage.order - 1,
    });

    if (!previousStage) return res.status(400).json({ error: "No previous stage" });

    // Fetch all questions for previous stage
    const questions = await Question.find({ stage: previousStage._id })
      .select("text options") // only send these fields
      .lean();

    res.json({ stage: previousStage.name, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// check if the user passed the quiz:
router.post("/:stageId/attempt-skip", async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.stageId);
    if (!stage) return res.status(404).json({ error: "Stage not found" });

    const { answers } = req.body;

    // Fetch questions to validate answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    let correctCount = 0;
    answers.forEach(a => {
      const q = questions.find(q => q._id.toString() === a.questionId);
      if (q && q.correctAnswer === a.answer) correctCount++;
    });

    const passRate = correctCount / questions.length;

    if (passRate >= 0.8) {
      // Unlock the next stage
      stage.isLocked = false;
      await stage.save();
      return res.json({ success: true, message: "Stage unlocked!" });
    }

    res.json({ success: false, message: "You did not pass. Review previous stage." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/stages?ids=id1,id2,id3
router.get("/", async (req, res) => {
  try {
    const ids = req.query.ids; // comma-separated IDs
    if (!ids) return res.status(400).json({ success: false, message: "No IDs provided" });

    const idsArray = ids.split(",");
    const stages = await Stage.find({ _id: { $in: idsArray } }).populate("level");

    res.json(stages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// get stages from progress controller 
router.get("/course/:languageId", getStagesByCourse);

export default router;
