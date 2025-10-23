import userModel from "../models/userModel.js";
import Stage from "../models/Stage.js";
import Course from "../models/Course.js";
import Level from "../models/Level.js";

// Initialize progress for a user when they start a course 
export const InitializeProgress = async (req, res) => {
  try {
    const { userId, language } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // initialise if not already existing 
    if (!user.progress.has(language)) {
      user.progress.set(language, {
        currentLevel: 1,
        currentStage: null,
        completedStages: [],
        totalXP: 0,
        lastActivity: new Date(),
      });
      await user.save();
    }
    res.json({ message: language + 'progress initialized', progress: user.progress.get(language) });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update progress when user completes a stage
export const completedStage = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { stageId } = req.body;

    // Fetch user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const course = user.selectedLanguage;
    if (!course) return res.status(400).json({ error: "No course selected" });

    // Initialize progress for course if missing
    if (!user.progress.has(course)) {
      user.progress.set(course, {
        currentLevel: null,
        currentStage: null,
        completedStages: [],
        totalXP: 0,
        lastActivity: new Date(),
      });
    }

    const progress = user.progress.get(course);

    // Fetch the completed stage
    const stage = await Stage.findById(stageId).populate("level");
    if (!stage) return res.status(404).json({ error: "Stage not found" });

    // Mark stage complete
    if (!progress.completedStages.includes(stage._id.toString())) {
      progress.completedStages.push(stage._id.toString());
      progress.totalXP += 50; // add XP
      progress.lastActivity = new Date();
    }

    // Fetch all stages in this level
    const stagesInLevel = await Stage.find({ level: stage.level._id }).sort({ order: 1 });

    // Check if all stages in level are completed
    const completedInLevel = stagesInLevel.filter(s => progress.completedStages.includes(s._id.toString()));

    if (completedInLevel.length === stagesInLevel.length) {
      // All stages completed → move to next level
      const nextLevel = await Level.findOne({
        course: stage.level.course,
        order: stage.level.order + 1
      });

      progress.currentLevel = nextLevel ? nextLevel._id : stage.level._id;

      // Set next stage as first stage of next level (or null if last level)
      const nextStage = nextLevel
        ? await Stage.findOne({ level: nextLevel._id }).sort({ order: 1 })
        : null;

      progress.currentStage = nextStage ? nextStage._id : null;
    } else {
      // Still in same level → next uncompleted stage
      const nextStage = stagesInLevel.find(s => !progress.completedStages.includes(s._id.toString()));
      progress.currentStage = nextStage ? nextStage._id : null;
      progress.currentLevel = stage.level._id;
    }

    // Save progress
    user.progress.set(course, progress);
    await user.save();

    res.json({ message: "Stage completed!", progress });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ error: err.message });
  }
};



// get user progress for a specific language
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const lang = user.selectedLanguage;
    const progress = user.progress.get(lang) || null;

    res.json({ language: lang, progress });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// stage controller 
export const getStagesByCourse = async (req, res) => {
  try {
    const { languageId } = req.params; // e.g., "Javascript"
    const { userId } = req.query;

    // Find course case-insensitive
    const course = await Course.findOne({ name: { $regex: `^${languageId}$`, $options: "i" } });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Get all levels for this course
    const allLevels = await Level.find({ course: course._id }).sort({ order: 1 });

    // Get all stages for this course by collecting stages from levels
    let allStages = [];
    for (const lvl of allLevels) {
      const stages = await Stage.find({ _id: { $in: lvl.stages } }).sort({ order: 1 });
      allStages = allStages.concat(stages);
    }

    // Get user progress
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const progressMap = user.progress || new Map();
    const progressObj = Object.fromEntries(progressMap);

    // Use the course name from DB to match progress key
    const langKey = Object.keys(progressObj).find(
      k => k.toLowerCase() === course.name.toLowerCase()
    );

    const progress = langKey ? progressMap.get(langKey) : {
      currentStage: null,
      currentLevel: 1,
      completedStages: [],
      totalXP: 0
    };


    res.json({ success: true, allStages, allLevels, getUserProgress: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

