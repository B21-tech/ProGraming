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
                                options: ["for loop", "while", "do-while", "foreach"],
                                correctAnswer: "while",
                                explanation:
                                    "Python's while checks the condition first.",
                            },
                            {
                                text: "Which loop iterates over items in a list?",
                                options: ["while", "for loop", "do-while", "loop"],
                                correctAnswer: "for loop",
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
                    {
                        stageName: "Functions",
                        levelName: "Intermediate",
                        questions: [
                            {
                                text: "What keyword defines a function in Python?",
                                options: ["func", "def", "define", "function"],
                                correctAnswer: "def",
                                explanation:
                                    "Python functions begin with the keyword def.",
                            },
                            {
                                text: "What happens if a function has no return statement?",
                                options: ["It returns None", "It returns 0", "It causes an error", "It loops infinitely"],
                                correctAnswer: "It returns None",
                                explanation:
                                    "Python functions without return automatically return None.",
                            },
                            {
                                text: "What is the purpose of the return statement?",
                                options: ["Ends the program", "Returns a value from a function", "Prints output", "Imports modules"],
                                correctAnswer: "Returns a value from a function",
                                explanation:
                                    "return sends a value back to the caller.",
                            },
                            {
                                text: "What is a default parameter?",
                                options: ["Parameter that must be passed", "Parameter with a predefined value", "Parameter that is optional but required later", "A global variable"],
                                correctAnswer: "Parameter with a predefined value",
                                explanation:
                                    "Default parameters take a preset value if no argument is given.",
                            },
                            {
                                text: "What is recursion?",
                                options: ["Loop inside a list", "Function calling itself", "Function inside another function", "Infinite loop"],
                                correctAnswer: "Function calling itself",
                                explanation:
                                    "Recursion occurs when a function calls itself.",
                            },
                        ],
                    },
                    {
                        stageName: "Lists & Tuples",
                        levelName: "Intermediate",
                        questions: [
                            {
                                text: "What's the difference between a list and a tuple?",
                                options: ["Lists are immutable, tuples are mutable", "Lists are mutable, tuples are immutable", "Both are immutable", "Both are mutable"],
                                correctAnswer: "Lists are mutable, tuples are immutable",
                                explanation:
                                    "Lists can be changed; tuples cannot.",
                            },
                            {
                                text: "How do you create an empty list?",
                                options: ["[]", "{}", "()", "empty[]"],
                                correctAnswer: "[]",
                                explanation:
                                    "Square brackets create lists.",
                            },
                            {
                                text: "What method adds an item to a list?",
                                options: ["add()", "push()", "append()", "insert()"],
                                correctAnswer: "append()",
                                explanation:
                                    "append() adds elements at the end of a list.",
                            },
                            {
                                text: "What happens if you try to modify a tuple?",
                                options: ["It changes value", "It returns None", "It raises an error", "It duplicates elements"],
                                correctAnswer: "It raises an error",
                                explanation:
                                    "Tuples are immutable, so modification raises an error.",
                            },
                            {
                                text: "What will len([1,2,3,4]) return?",
                                options: ["3", "4", "5", "Error"],
                                correctAnswer: "4",
                                explanation:
                                    "The len() function returns the number of elements.",
                            },
                        ],
                    },
                    {
                        stageName: "Dictionaries",
                        levelName: "Advanced",
                        questions: [
                            {
                                text: "What are keys in a Python dictionary?",
                                options: ["Values only", "Duplicates", "Unique identifiers", "Index numbers"],
                                correctAnswer: "Unique identifiers",
                                explanation:
                                    "Keys uniquely identify values in a dictionary.",
                            },
                            {
                                text: "Which syntax creates a dictionary?",
                                options: ["dict = []", "dict = {}", "dict = ()", "dict = <>"],
                                correctAnswer: "dict = {}",
                                explanation:
                                    "Curly braces {} define dictionaries.",
                            },
                            {
                                text: "How do you access a value by key?",
                                options: ["dict.key", "dict[key]", "dict(value)", "dict.getkey()"],
                                correctAnswer: "dict[key]",
                                explanation:
                                    "You access values using square brackets and the key.",
                            },
                            {
                                text: "What method removes a key-value pair?",
                                options: ["remove", "delete", "pop()", "discard()"],
                                correctAnswer: "pop()",
                                explanation:
                                    "pop() removes a key and returns its value.",
                            },
                            {
                                text: "What happens if you use a list as a key?",
                                options: ["Works fine", "Raises an error", "Converts it automatically", "Stores its memory address"],
                                correctAnswer: "Raises an error",
                                explanation:
                                    "Lists are unhashable and can't be used as dictionary keys.",
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
