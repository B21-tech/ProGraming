import Question from "../models/Question.js";

export const getStageQuestions = async (req, res) => {
  try {
    const { stageId } = req.params;

    // Fetch all questions for this stage
    const allQuestions = await Question.find({ stage: stageId });

    if (!allQuestions.length) {
      return res.status(404).json({ success: false, message: "No questions found for this stage" });
    }

    // Randomize and select 10 questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 10);

    res.json({ success: true, questions: selectedQuestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
