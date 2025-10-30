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
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};

const seedQuestions = async () => {
    try {
        await connectDB();

        // await Question.deleteMany();
        // console.log("Old questions cleared");

        const courses = await Course.find();
        const stages = await Stage.find().populate("level");
        const levels = await Level.find();

        // -----------------------
        // Define sample questions (with mini-explanations)
        // -----------------------
        const courseQuestions = [
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
                                explanation:
                                    "Python doesn't require explicit variable declarations. You just assign a value using '='.",
                            },
                            {
                                text: "Which of these is a valid data type in Python?",
                                options: ["integer", "number", "int", "digit"],
                                correctAnswer: "int",
                                explanation:
                                    "'int' is the correct keyword for integers in Python. 'integer' and 'number' are not data types.",
                            },
                            {
                                text: "Which function checks the data type of a variable?",
                                options: ["typeof()", "type()", "check()", "datatype()"],
                                correctAnswer: "type()",
                                explanation:
                                    "In Python, the built-in type() function returns the data type of any variable or object.",
                            },
                            {
                                text: "How do you assign multiple variables at once?",
                                options: ["a = 1; b = 2", "a, b = 1, 2", "a = b = 1, 2)", "None of the Above"],
                                correctAnswer: "a, b = 1, 2",
                                explanation:
                                    "Python supports tuple unpacking for multiple assignments.",
                            },
                            {
                                text: "What is the result of 5 + 3.0?",
                                options: ["8", "8.0", "53", "Error"],
                                correctAnswer: "8.0",
                                explanation:
                                    "Adding int and float returns a float in Python.",
                            },
                        ],
                    },
                    {
                        stageName: "Operators",
                        levelName: "Beginner",
                        questions: [
                            {
                                text: "What does the '+' operator do in Python?",
                                options: ["Adds numbers", "Subtracts numbers", "Compares values", "Joins arrays"],
                                correctAnswer: "Adds numbers",
                                explanation:
                                    "The '+' operator performs addition for numbers and concatenation for strings and lists.",
                            },
                            {
                                text: "What will '5 == /5/' return?",
                                options: ["true", "false", "error", "undefined"],
                                correctAnswer: "false",
                                explanation:
                                    "In Python, '==' checks both value and type. Since one is int and the other is str, it returns false.",
                            },
                            {
                                text: "Which operator checks both value and type?",
                                options: ["==", "===", "!=", "<>"],
                                correctAnswer: "==",
                                explanation:
                                    "Python's '==' already compares both value and type, unlike JavaScript where you use '==='.",
                            },
                            {
                                text: "What does // do in Python?",
                                options: ["Division", "Floor division", "Modulo", "Exponent"],
                                correctAnswer: "Floor division",
                                explanation:
                                    "'//' divides and returns the integer part.",
                            },
                            {
                                text: "What is the value of x after x = 5; x += 3?",
                                options: ["3", "5", "8", "Error"],
                                correctAnswer: "8",
                                explanation:
                                    "+= adds the value to the variable.",
                            },
                        ],
                    },
                    {
                        stageName: "Conditionals",
                        levelName: "Beginner",
                        questions: [
                            {
                                text: "Which keyword is used for conditional branching?",
                                options: ["if", "loop", "switch", "case"],
                                correctAnswer: "if",
                                explanation:
                                    "'if' evaluates a condition to control flow.",
                            },
                            {
                                text: "What keyword handles the case where there are no more conditions?",
                                options: ["elif", "else", "case", "default"],
                                correctAnswer: "else",
                                explanation:
                                    "'else' executes if no previous conditions are true.",
                            },
                            {
                                text: "Which keyword allows multiple conditions?",
                                options: ["elif", "if", "else", "switch"],
                                correctAnswer: "elif",
                                explanation:
                                    "'elif' lets you check additional conditions",
                            },
                            {
                                text: "How do you check if two conditions are both true?",
                                options: ["and", "or", "&", "|"],
                                correctAnswer: "and",
                                explanation:
                                    "'and' evaluates to True only if both sides are True.",
                            },
                            {
                                text: "What is the output of \n if not False: print('Yes')?",
                                options: ["Yes", "No", "False", "Error"],
                                correctAnswer: "Yes",
                                explanation:
                                    "'not' False is True, so the print executes.",
                            },
                        ],
                    },
                    {
                        stageName: "Loops",
                        levelName: "Intermediate",
                        questions: [
                            {
                                text: "Which loop checks the condition before running?",
                                options: ["for", "while", "do-while", "foreach"],
                                correctAnswer: "while",
                                explanation:
                                    "Python's while checks the condition first.",
                            },
                            {
                                text: "Which loop iterates over items in a list?",
                                options: ["while", "for", "do-while", "loop"],
                                correctAnswer: "for",
                                explanation:
                                    "for loops iterate over iterable objects.",
                            },
                            {
                                text: "What does break do in a loop?",
                                options: ["Skips iteration", "Exits loop", "Restarts loop", "Ends program"],
                                correctAnswer: "Exits loop",
                                explanation:
                                    "'break' stops the current loop immediately.",
                            },
                            {
                                text: "What does continue do?",
                                options: ["Exits loop", "Skips current iteration", "Ends program", "Restarts loop"],
                                correctAnswer: "Skips current iteration",
                                explanation:
                                    "'continue' jumps to the next loop iteration.",
                            },
                            {
                                text: "How do you loop a fixed number of times?",
                                options: ["for i in range(n)", "while i<n", "loop(n)", "repeat(n)"],
                                correctAnswer: "for i in range(n)",
                                explanation:
                                    "range(n) generates numbers from 0 to n-1.",
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
                    console.warn(`Stage not found: ${stageSet.stageName} (${stageSet.levelName})`);
                    continue;
                }

                for (const q of stageSet.questions) {
                    await Question.create({
                        stage: stage._id,
                        text: q.text,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation, // ✅ Added mini explanation
                    });
                }

                console.log(`Added ${stageSet.questions.length} questions for ${stage.name}`);
            }
        }

        console.log("All questions seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err.message);
        process.exit(1);
    }
};

seedQuestions();
