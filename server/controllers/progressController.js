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
export const completeStage = async (req, res) => {
  try {
    const { userId, stageId } = req.params;
    const { score, total } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const stage = await Stage.findById(stageId).populate("level");
    if (!stage) return res.status(404).json({ success: false, message: "Stage not found" });

    const lang = user.selectedLanguage;
    let progress = user.progress.get(lang);

    if (!progress) {
      progress = {
        currentLevel: 1,
        currentStage: stageId,
        completedStages: [],
        totalXP: 0,
        streak: 0,
        lastStreakDate: null,
      };
    }

    const percentage = (score / total) * 100;
    const passingScore = 60; // Minimum % to unlock next stage

    // --------------------------
    // Determine XP for the attempt
    // --------------------------
    const alreadyCompleted = progress.completedStages.includes(stageId);
    const gainedXP = alreadyCompleted ? 5 : 50;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let lastDate = progress.lastStreakDate ? new Date(progress.lastStreakDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    if (!lastDate) {
      progress.streak = 1;
    } else {
      const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        progress.streak += 1;
      } else if (diffDays > 1) {
        progress.streak = 1;
      }
    }
    progress.lastStreakDate = new Date();

    // If user passed the stage
    if (percentage >= passingScore) {
      if (!alreadyCompleted) progress.completedStages.push(stageId);
      progress.totalXP += gainedXP;

      // --------------------------
      // Unlock next stage
      // --------------------------
      const levelStages = stage.level.stages;
      const currentIndex = levelStages.indexOf(stageId);

      if (currentIndex < levelStages.length - 1) {
        const nextStageId = levelStages[currentIndex + 1];
        if (!progress.completedStages.includes(nextStageId)) progress.currentStage = nextStageId;
      } else {
        const nextLevel = await Level.findOne({
          course: stage.level.course,
          order: stage.level.order + 1,
        }).populate("stages");

        if (nextLevel && nextLevel.stages.length > 0) {
          const nextStageId = nextLevel.stages[0]._id;
          if (!progress.completedStages.includes(nextStageId)) {
            progress.currentStage = nextStageId;
            progress.currentLevel = nextLevel.order;
          }
        } else {
          progress.currentStage = progress.currentStage || stageId;
        }
      }
    } else if (alreadyCompleted) {
      progress.totalXP += 5; // replay XP
    }

    // Save progress
    user.progress.set(lang, progress);
    await user.save();

    res.json({
      success: true,
      message: alreadyCompleted
        ? "Stage replayed! XP added."
        : "Stage completed and next unlocked!",
      progress,
      unlocked: percentage >= passingScore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// get user progress for a specific language
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get all courses (Map → Object)
    const progress = Object.fromEntries(user.progress.entries());

    res.json({
      success: true,
      userId,
      progress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
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




///// NEWWWWWWW //////
// Allow the uset to register for a new course:
export const registerCourse = async (req, res) => {
  try {
    const { userId, courseName } = req.body;

    // Validate inputs
    if (!userId || !courseName) {
      return res.status(400).json({ success: false, message: "Missing userId or courseName" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if course already registered
    if (user.progress.has(courseName)) {
      return res.status(400).json({ success: false, message: "Already registered for this course" });
    }

    // Initialize new course progress
    const newProgress = {
      currentLevel: 1,
      currentStage: null,
      completedStages: [],
      totalXP: 0,
      lastActivity: new Date(),
      streak: 0,
      lastStreakDate: null
    };

    // Add to user's progress map
    user.progress.set(courseName, newProgress);

    // Make this the current active course
    user.selectedLanguage = courseName;

    // Save user
    await user.save();

    return res.status(201).json({
      success: true,
      message: `Successfully registered for ${courseName}!`,
      progress: newProgress,
      activeCourse: courseName
    });

  } catch (err) {
    console.error("Error registering course:", err);
    return res.status(500).json({ success: false, message: "Server error while registering course" });
  }
};


// NEWWWW
export const switchCourse = async (req, res) => {
  try {
    const { userId, courseName } = req.body;
    if (!userId || !courseName) {
      return res.status(400).json({ success: false, message: "Missing userId or courseName" });
    }

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.progress.has(courseName)) {
      return res.status(400).json({ success: false, message: "Course not registered yet" });
    }

    // Update selected language
    user.selectedLanguage = courseName;
    await user.save();

    res.json({ success: true, message: `Switched to ${courseName}`, selectedLanguage: courseName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
