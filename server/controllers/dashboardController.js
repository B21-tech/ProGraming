// import userModel from "../models/userModel.js";

// export const getDashboard = async (req, res) => {
//   try {
//     // Ensure user is authenticated
//     if (!req.userId)
//       return res.status(401).json({ success: false, message: "User not authenticated" });

//     const user = await userModel.findById(req.userId);
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     // Greeting
//     const hour = new Date().getHours();
//     let greeting = "Hello";
//     if (hour < 12) greeting = "Good Morning";
//     else if (hour < 18) greeting = "Good Afternoon";
//     else greeting = "Good Evening";

//     // Get user progress for the selected language
//     const lang = user.selectedLanguage;
//     const progress = user.progress.get(lang) || {
//       currentLevel: 1,
//       currentStage: null,
//       completedStages: [],
//       totalXP: 0,
//       lastActivity: null,
//     };

//     // Send JSON
//     res.json({
//       success: true,
//       greeting: `${greeting}, ${user.username}`,
//       username: user.username,
//       selectedLanguage: lang,
//       OnboardingComplete: user.OnboardingComplete,
//       progress, // include progress
//     });
//   } catch (error) {
//     console.error("Dashboard error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


import userModel from "../models/userModel.js";
import Course from "../models/Course.js"; // import Course model

export const getDashboard = async (req, res) => {
  try {
    if (!req.userId)
      return res.status(401).json({ success: false, message: "User not authenticated" });

    const user = await userModel.findById(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Greeting
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    // Fetch all courses
    const allCoursesDocs = await Course.find({}, "name").lean();
    const allCourses = allCoursesDocs.map(course => course.name);

    const progressMap = user.progress || new Map();

    // 🔥 Reset streaks if user skipped a day
    let streakReset = false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let [courseName, courseProgress] of progressMap.entries()) {
      const lastStreakDate = courseProgress.lastStreakDate ? new Date(courseProgress.lastStreakDate) : null;
      if (lastStreakDate) {
        lastStreakDate.setHours(0, 0, 0, 0);
        const diffDays = (today - lastStreakDate) / (1000 * 60 * 60 * 24);

        if (diffDays > 1 && courseProgress.streak !== 0) {
          courseProgress.streak = 0;
          user.progress.set(courseName, courseProgress);
          streakReset = true;
        }
      }
    }

    if (streakReset) {
      await user.save();
    }

    // Convert to lowercase for comparison
    const registeredCourses = Array.from(progressMap.keys()).map(course => course.toLowerCase());
    if (user.selectedLanguage) {
      registeredCourses.push(user.selectedLanguage.toLowerCase());
    }

    const recommendedCourses = allCourses.filter(
      (course) => !registeredCourses.includes(course.toLowerCase())
    );

    // Selected language progress
    const lang = user.selectedLanguage;
    const progress = lang ? user.progress.get(lang) : null;

    let totalXP = 0;
    let streak = 0;
    const topCourses = [];

    for (let [courseName, courseProgress] of progressMap.entries()) {
      const xp = courseProgress.totalXP || 0;
      totalXP += xp;
      topCourses.push({ name: courseName, xp });

      if (courseProgress.streak > streak) streak = courseProgress.streak;
    }

    // Include active course if missing
    if (user.selectedLanguage && !topCourses.find(c => c.name === user.selectedLanguage)) {
      const activeProgress = user.progress.get(user.selectedLanguage);
      const xp = activeProgress?.totalXP || 0;
      topCourses.push({ name: user.selectedLanguage, xp });

      totalXP += xp;
      const activeStreak = activeProgress?.streak || 0;
      if (activeStreak > streak) streak = activeStreak;
    }

    res.json({
      success: true,
      greeting: `${greeting}, ${user.username}`,
      username: user.username,
      selectedLanguage: lang,
      OnboardingComplete: user.OnboardingComplete,
      progress,
      recommendedCourses,
      totalXP,
      topCourses,
      streak,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addXp = async (req, res) => {
  try{
    const user = await userModel.findById(req.userId);
    if(!user)
      return res.status(404).json({success: false, message: "User not found"});

    const { amount } = req.body;
    if(!amount || isNaN(amount)){
      return res.status(400).json({success: false, message: "Invalid XP amount"});
    }
    // finding the user's progress map
    const selectedCourse = user.selectedLanguage;
    if (!selectedCourse) {
      return res.status(400).json({ success: false, message: "No active course selected" });
    }

    // get user progress from that code 
    const courseProgress = user.progress.get(selectedCourse) || { totalXP: 0, streak: 0 };
    courseProgress.totalXP = (courseProgress.totalXP || 0) + Number(amount);

    // update the user's progress map
    user.progress.set(selectedCourse, courseProgress);
    await user.save();

    res.json({
      success: true,
      message: 'Added ' + amount + ' XP to ' + selectedCourse,
      totalXP: courseProgress.totalXP
    });
  }
  catch(error){
    console.error("Add XP error: ", error);
    res.status(500).json({success: false, message: error.message});
  }
}