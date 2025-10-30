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
        // console.log(" Old questions cleared");

        const courses = await Course.find();
        const stages = await Stage.find().populate("level");
        const levels = await Level.find();

        // -----------------------
        // Define sample questions (with mini-explanations)
        // -----------------------
        const courseQuestions = [


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
                                explanation:
                                    "The 'var' keyword allows C# to infer the variable type automatically at compile time.",
                            },
                            {
                                text: "Which data type stores true or false values?",
                                options: ["bool", "int", "string", "bit"],
                                correctAnswer: "bool",
                                explanation:
                                    "The 'bool' type represents Boolean values — true or false — used in conditions and logic.",
                            },
                            {
                                text: "How do you write a comment in C#?",
                                options: ["// comment", "# comment", "/* comment */", "-- comment"],
                                correctAnswer: "// comment",
                                explanation:
                                    "C# uses '//' for single-line comments and '/* ... */' for multi-line comments.",
                            },
                            {
                                text: "What is the default value of an uninitialized int variable in C#?",
                                options: ["null", "0", "-1", "undefined"],
                                correctAnswer: "0",
                                explanation:
                                    "",
                            },
                        ],
                    },
                    {
                        stageName: "Operators",
                        levelName: "Beginner",
                        questions: [
                            {
                                text: "What is the result of 10 % 3 in C#?",
                                options: ["3", "1", "0", "3.33"],
                                correctAnswer: "1",
                                explanation:
                                    "The % operator gives the remainder after division, and 10 ÷ 3 leaves 1.",
                            },
                            {
                                text: "Which operator has the highest precedence?",
                                options: ["+ (addition)", "= (assignment)", "* (multiplication)", "== (equality)"],
                                correctAnswer: "* (multiplication)",
                                explanation:
                                    "Multiplication is evaluated before addition and assignment in C#.",
                            },
                            {
                                text: "Which operator is used for conditional AND that short-circuits?",
                                options: ["&", "|", "&&", "||"],
                                correctAnswer: "&&",
                                explanation:
                                    "The && operator stops evaluating once the first condition is false.",
                            },
                            {
                                text: "What does ++x do?",
                                options: ["Increments x after use", "Increments x before use", "Decrements x", "Nothing"],
                                correctAnswer: "Increments x before use",
                                explanation:
                                    "++x increments the variable before it's used in the expression..",
                            },
                            {
                                text: "What is the value of x after: int x = 5; x *= 2 + 1;",
                                options: ["11", "15", "7", "8"],
                                correctAnswer: "15",
                                explanation:
                                    "C# evaluates 2 + 1 first, then multiplies 5 by 3, giving 15.",
                            },
                        ],
                    },
                    {
                        stageName: "Conditionals",
                        levelName: "Beginner",
                        questions: [
                            {
                                text: "Which keyword is used in a switch statement to handle all other cases?",
                                options: ["defualt", "else", "case", "otherwise"],
                                correctAnswer: "defualt",
                                explanation:
                                    "The default keyword handles any case not matched by other labels.",
                            },
                            {
                                text: "How many conditions can an if statement have?",
                                options: ["Only one", "Exactly two", "Multiple using logic operations", "Maximum of three"],
                                correctAnswer: "Multiple using logic operations",
                                explanation:
                                    "You can combine multiple conditions using logical operators like && or ||.",
                            },
                            {
                                text: "What does if (x != 5) check?",
                                options: ["x equals 5", "x does not equal 5", "x is greater than 5", "is less than 5"],
                                correctAnswer: "x does not equal 5",
                                explanation:
                                    "!= means “not equal to",
                            },
                            {
                                text: "Which comparison returns a boolean?",
                                options: ["==", "=", "+=", "*="],
                                correctAnswer: "==",
                                explanation:
                                    "== checks equality and returns true or false.",
                            },
                        ],
                    },
                    {
                        stageName: "Loops",
                        levelName: "Intermediate",
                        questions: [
                            {
                                text: "Which loop checks the condition first?",
                                options: ["for", "while", "do-while", "foreach"],
                                correctAnswer: "while",
                                explanation:
                                    "while evaluates the condition before the loop runs.",
                            },
                            {
                                text: "What type of loop is best for iterating arrays?",
                                options: ["for", "foreach", "while", "do-while"],
                                correctAnswer: "foreach",
                                explanation:
                                    "foreach iterates over collections easily.",
                            },
                            {
                                text: "Which keyword exits a loop immediately?",
                                options: ["break", "continue", "exit", "stop"],
                                correctAnswer: "break",
                                explanation:
                                    "break terminates the loop instantly",
                            },
                            {
                                text: "What does continue do in a loop?",
                                options: ["Exits loop", "Skips current iteration", "Ends program", "Restarts loop"],
                                correctAnswer: "Skips current iteration",
                                explanation:
                                    "continue jumps to the next iteration.",
                            },
                        ],
                    }
                ],
            },
        ];

        // -----------------------
        // Save questions to DB
        // -----------------------
        for (const courseBlock of courseQuestions) {
            const course = courses.find(c => c.name === courseBlock.courseName);
            if (!course) {
                console.warn(`Course not found: ${courseBlock.courseName}`);
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
