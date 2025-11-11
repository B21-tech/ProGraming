import express from 'express';
import { completeStage, getUserProgress, InitializeProgress, registerCourse, switchCourse } from "../controllers/progressController.js";
import userAuth from '../middleware/userAuth.js';

import userModel from '../models/userModel.js';
import Course from '../models/Course.js';

const router = express.Router();

router.post("/intialize", userAuth, InitializeProgress);
router.post("/complete/:userId/:stageId", userAuth, completeStage);
router.get("/:userId", userAuth, getUserProgress);

// GET /api/progress/:userId/full
router.get("/:userId/full", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // get user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // get user's selected course
    const course = await Course.findOne({ name: user.selectedLanguage }).populate({
      path: "levels",
      populate: { path: "stages" }
    });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // send back full course + user progress
    res.json({
      success: true,
      language: course.name,
      progress: user.progress.get(course.name) || {}, // empty object if new user
      levels: course.levels
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



/////// NEWWWWW /////
router.post("/registerCourse", userAuth, registerCourse);
router.post("/switchCourse", userAuth, switchCourse);

// Leasership board 
router.get("/", userAuth, async (req, res) => {
  try {
    const users = await userModel.find({}, "username progress").lean();

    // Compute total XP per user
    const leaderboard = users.map((user) => {
      let totalXP = 0;

      if (user.progress) {
        for (const [_, progressData] of Object.entries(user.progress)) {
          totalXP += progressData.totalXP || 0;
        }
      }

      return {
        username: user.username,
        totalXP
      };
    });

    // Sort in descending order by total XP
    leaderboard.sort((a, b) => b.totalXP - a.totalXP);

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;