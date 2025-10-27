// seedData.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import Level from "./models/Level.js";
import Stage from "./models/Stage.js";

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

const seedData = async () => {
  try {
    await connectDB();

    // Drop the database to avoid duplicates
    await Stage.deleteMany();
    await Level.deleteMany();
    await Course.deleteMany();
    console.log("🗑️ Course, Level, and Stage collections cleared");

    // Define courses with realistic levels and stages
    const coursesData = [
      {
        name: "JavaScript",
        levels: [
          {
            name: "Beginner",
            stages: ["Variables & Data Types", "Operators & Expressions", "Conditionals"],
          },
          {
            name: "Intermediate",
            stages: ["Loops", "Functions", "Arrays"],
          },
          {
            name: "Advanced",
            stages: ["Objects", "Classes", "Async & Promises"],
          },
        ],
      },
      {
        name: "Python",
        levels: [
          {
            name: "Beginner",
            stages: ["Variables & Data Types", "Operators", "Conditionals"],
          },
          {
            name: "Intermediate",
            stages: ["Loops", "Functions", "Lists & Tuples"],
          },
          {
            name: "Advanced",
            stages: ["Dictionaries", "Classes", "Modules & Packages"],
          },
        ],
      },
      {
        name: "C#",
        levels: [
          {
            name: "Beginner",
            stages: ["Variables & Data Types", "Operators", "Conditionals"],
          },
          {
            name: "Intermediate",
            stages: ["Loops", "Methods", "Arrays & Lists"],
          },
          {
            name: "Advanced",
            stages: ["Objects & Classes", "Inheritance", "Async Programming"],
          },
        ],
      },
    ];

    for (let courseData of coursesData) {
      const course = await Course.create({ name: courseData.name });

      for (let i = 0; i < courseData.levels.length; i++) {
        const levelData = courseData.levels[i];

        const level = await Level.create({
          name: levelData.name,
          order: i + 1,
          course: course._id,
        });

        const stageIds = [];

        for (let j = 0; j < levelData.stages.length; j++) {
          const stageName = levelData.stages[j];

          const stage = await Stage.create({
            name: stageName,
            order: j + 1,
            level: level._id,
            isLocked: j !== 0, // only first stage unlocked
          });

          stageIds.push(stage._id);
        }

        level.stages = stageIds;
        await level.save();

        course.levels.push(level._id);
        await course.save();
      }
    }

    console.log("✅ Sample data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();
