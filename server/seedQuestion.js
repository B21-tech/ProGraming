// seedQuestions.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stage from "./models/Stage.js";
import Level from "./models/Level.js";
import Course from "./models/Course.js";
import Question from "./models/Question.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

const seedQuestions = async () => {
  try {
    await connectDB();

    await Question.deleteMany();
    console.log("🗑️ Old questions cleared");

    // Get courses, levels, and stages
    const courses = await Course.find();
    const stages = await Stage.find().populate("level");
    const levels = await Level.find();

    // -----------------------
    // Define sample questions
    // -----------------------
    const courseQuestions = [
      {
        courseName: "JavaScript",
        data: [
          {
            stageName: "Variables & Data Types",
            levelName: "Beginner",
            questions: [
              {
                text: "Which keyword declares a variable in JavaScript?",
                options: ["let", "int", "define", "varname"],
                correctAnswer: "let",
              },
              {
                text: "What type of value is true or false?",
                options: ["String", "Number", "Boolean", "Object"],
                correctAnswer: "Boolean",
              },
              {
                text: "Which of these is a valid variable name?",
                options: ["2name", "my_name", "my name", "let"],
                correctAnswer: "my_name",
              },
            ],
          },
          {
            stageName: "Operators & Expressions",
            levelName: "Beginner",
            questions: [
              {
                text: "What does the '+' operator do in JavaScript?",
                options: ["Adds numbers", "Subtracts numbers", "Compares values", "Joins arrays"],
                correctAnswer: "Adds numbers",
              },
              {
                text: "What will '5 == \"5\"' return?",
                options: ["true", "false", "error", "undefined"],
                correctAnswer: "true",
              },
              {
                text: "Which operator checks both value and type?",
                options: ["==", "===", "!=", "<>"],
                correctAnswer: "===",
              },
            ],
          },
        ],
      },
      {
        courseName: "Python",
        data: [
          {
            stageName: "Variables & Data Types",
            levelName: "Beginner",
            questions: [
              {
                text: "How do you declare a variable in Python?",
                options: ["var x = 5", "x = 5", "int x = 5", "define x 5"],
                correctAnswer: "x = 5",
              },
              {
                text: "Which of these is a valid data type in Python?",
                options: ["integer", "number", "int", "digit"],
                correctAnswer: "int",
              },
              {
                text: "Which function checks the data type of a variable?",
                options: ["typeof()", "type()", "check()", "datatype()"],
                correctAnswer: "type()",
              },
            ],
          },
        ],
      },
      {
        courseName: "C#",
        data: [
          {
            stageName: "Variables & Data Types",
            levelName: "Beginner",
            questions: [
              {
                text: "Which keyword declares a variable in C#?",
                options: ["let", "dim", "var", "int"],
                correctAnswer: "var",
              },
              {
                text: "Which data type stores true or false values?",
                options: ["bool", "int", "string", "bit"],
                correctAnswer: "bool",
              },
              {
                text: "How do you write a comment in C#?",
                options: ["// comment", "# comment", "/* comment */", "-- comment"],
                correctAnswer: "// comment",
              },
            ],
          },
        ],
      },
    ];

    // -----------------------
    // Save questions to DB
    // -----------------------
    for (const courseBlock of courseQuestions) {
      const course = courses.find(c => c.name === courseBlock.courseName);
      if (!course) {
        console.warn(`⚠️ Course not found: ${courseBlock.courseName}`);
        continue;
      }

      for (const stageSet of courseBlock.data) {
        const stage = stages.find(
          s =>
            s.name === stageSet.stageName &&
            s.level.name === stageSet.levelName &&
            s.level.course.toString() === course._id.toString()
        );

        if (!stage) {
          console.warn(`⚠️ Stage not found: ${stageSet.stageName} (${stageSet.levelName})`);
          continue;
        }

        for (const q of stageSet.questions) {
          await Question.create({
            stage: stage._id,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          });
        }

        console.log(`✅ Added ${stageSet.questions.length} questions for ${stage.name}`);
      }
    }

    console.log("🎉 All questions seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedQuestions();
