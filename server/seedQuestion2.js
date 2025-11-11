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
                                options: ["for loop", "while", "do-while", "foreach"],
                                correctAnswer: "while",
                                explanation:
                                    "while evaluates the condition before the loop runs.",
                            },
                            {
                                text: "What type of loop is best for iterating arrays?",
                                options: ["for loop", "foreach", "while", "do-while"],
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
                    },
                    {
                        stageName: "Methods",
                        levelName: "Intermediate",
                        questions: [
                            {
                                text: "What is the main purpose of a method in C#?",
                                options: ["To store data permanently", "To execute a specific block of code when called", "To define a class", "To initialize an array"],
                                correctAnswer: "To execute a specific block of code when called",
                                explanation:
                                    "Methods are reusable blocks of code that perform a specific task when called.",
                            },
                            {
                                text: "Which keyword is used to define a method that doesn't return any value?",
                                options: ["void", "return", "null", "none"],
                                correctAnswer: "void",
                                explanation:
                                    "The void keyword specifies that a method does not return a value.",
                            },
                            {
                                text: "What is a parameter in a method?",
                                options: ["A global variable", "A variable passed into a method", "A constant value", "A data type"],
                                correctAnswer: "A variable passed into a method",
                                explanation:
                                    "Parameters allow data to be passed into methods for use inside them.",
                            },
                            {
                                text: "What is the return type of this method: \n int Add(int a, int b)?",
                                options: ["void", "int", "string", "bool"],
                                correctAnswer: "int",
                                explanation:
                                    "The method returns an integer since its return type is int.",
                            },
                        ],
                    },
                    {
                        stageName: "Arrays & Lists",
                        levelName: "Intermediate",
                        questions: [
                            {
                                text: "What is the index of the first element in an array in C#?",
                                options: ["0", "1", "-1", "Depends on the type"],
                                correctAnswer: "0",
                                explanation:
                                    "C# arrays are zero-indexed, so the first element is at index 0.",
                            },
                            {
                                text: "Which syntax correctly initializes an array of integers?",
                                options: ["int[] nums = new int[5];", "array nums = int[5];", "int nums = array[5];", "int[5] nums;"],
                                correctAnswer: "int[] nums = new int[5];",
                                explanation:
                                    "Arrays use the new keyword to allocate memory.",
                            },
                            {
                                text: "What class is commonly used for dynamic lists in C#?",
                                options: ["Array", "List<T>", "ArrayList", "Collection"],
                                correctAnswer: "List<T>",
                                explanation:
                                    "List<T> from System.Collections.Generic allows dynamic resizing.",
                            },
                            {
                                text: "Which method adds an item to a List in C#?",
                                options: ["Insert()", "Add()", "Push()", "Append()"],
                                correctAnswer: "Add()",
                                explanation:
                                    "Add() appends an element to the end of a List.",
                            },
                        ],
                    },
                    {
                        stageName: "Objects & Classes",
                        levelName: "Advanced",
                        questions: [
                            {
                                text: "What is an object in C#?",
                                options: ["A data type", "A variable that holds methods only", "An instance of a class", "A constant"],
                                correctAnswer: "An instance of a class",
                                explanation:
                                    "An object is a concrete instance created from a class blueprint.",
                            },
                            {
                                text: "What keyword is used to create an object?",
                                options: ["create", "make", "new", "class"],
                                correctAnswer: "new",
                                explanation:
                                    "The new keyword instantiates an object.",
                            },
                            {
                                text: "What is the purpose of a constructor?",
                                options: ["To destroy objects", "To initialize new objects", "To handle errors", "To print output"],
                                correctAnswer: "To initialize new objects",
                                explanation:
                                    "Constructors initialize fields when an object is created.",
                            },
                            {
                                text: "Which modifier allows class members to be accessed only inside the same class?",
                                options: ["public", "protected", "private", "internal"],
                                correctAnswer: "private",
                                explanation:
                                    "private members are accessible only within the class itself.",
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
