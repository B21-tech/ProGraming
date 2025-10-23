import userModel from "../models/userModel.js";

export const getDashboard = async (req, res) => {
  try {
    // ✅ ensure user is authenticated
    if (!req.userId)
      return res.status(401).json({ success: false, message: "User not authenticated" });

    const user = await userModel.findById(req.userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // ✅ basic greeting
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    // ✅ send clean JSON
    res.json({
      success: true,
      greeting: `${greeting}, ${user.username}`,
      username: user.username,
      selectedLanguage: user.selectedLanguage,
      OnboardingComplete: user.OnboardingComplete,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

