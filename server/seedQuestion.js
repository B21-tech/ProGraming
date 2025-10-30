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
    console.log("Old questions cleared");

    const courses = await Course.find();
    const stages = await Stage.find().populate("level");
    const levels = await Level.find();

    // -----------------------
    // Define sample questions (with mini-explanations)
    // -----------------------
    const courseQuestions = [
      {
        courseName: "JavaScript",
        data: [
          // ===================== BEGINNER LEVEL =====================
          {
            stageName: "Variables & Data Types",
            levelName: "Beginner",
            questions: [
              {
                text: "Which keyword declares a variable in JavaScript?",
                options: ["let", "int", "define", "varname"],
                correctAnswer: "let",
                explanation:
                  "'let' declares block-scoped variables, safer than 'var'.",
              },
              {
                text: "What type of value is true or false?",
                options: ["String", "Number", "Boolean", "Object"],
                correctAnswer: "Boolean",
                explanation:
                  "Booleans represent logical values — true or false.",
              },
              {
                text: "Which of these is a valid variable name?",
                options: ["2name", "my_name", "my name", "let"],
                correctAnswer: "my_name",
                explanation:
                  "Variable names can’t start with numbers or contain spaces.",
              },
              {
                text: "What value does 'typeof null' return?",
                options: ["null", "object", "undefined", "number"],
                correctAnswer: "object",
                explanation:
                  "In JavaScript, 'typeof null' is 'object' due to legacy reasons.",
              },
              {
                text: "Which type of variable can’t be reassigned?",
                options: ["let", "var", "const", "mutable"],
                correctAnswer: "const",
                explanation:
                  "'const' declares a constant value that cannot be reassigned.",
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
                explanation:
                  "The '+' operator adds numbers or concatenates strings.",
              },
              {
                text: "What will '5 == \"5\"' return?",
                options: ["true", "false", "error", "undefined"],
                correctAnswer: "true",
                explanation:
                  "'==' compares values without type checking, so '5' equals 5.",
              },
              {
                text: "Which operator checks both value and type?",
                options: ["==", "===", "!=", "<>"],
                correctAnswer: "===",
                explanation:
                  "'===' checks both value and type for a safer comparison.",
              },
              {
                text: "What is the result of '10 % 3'?",
                options: ["1", "0", "3", "3.33"],
                correctAnswer: "1",
                explanation:
                  "'%' gives the remainder after division; 10 ÷ 3 leaves 1.",
              },
              {
                text: "What does '++x' do?",
                options: ["Increments x by 1 before use", "Increments x by 1 after use", "Decrements x by 1", "Throws error"],
                correctAnswer: "Increments x by 1 before use",
                explanation:
                  "Prefix '++x' increases x before it’s used in an expression.",
              },
            ],
          },
          {
            stageName: "Conditionals",
            levelName: "Beginner",
            questions: [
              {
                text: "Which keyword starts a conditional branch?",
                options: ["if", "loop", "case", "switch"],
                correctAnswer: "if",
                explanation:
                  "'if' starts a conditional branch to run code when a condition is true.",
              },
              {
                text: "Which operator represents logical AND?",
                options: ["&&", "||", "&", "|"],
                correctAnswer: "&&",
                explanation:
                  "'&&' is the logical AND operator and short-circuits if the first condition is false.",
              },
              {
                text: "Which statement executes different code based on multiple conditions?",
                options: ["if-else", "for", "while", "switch-case"],
                correctAnswer: "switch-case",
                explanation:
                  "'switch-case' allows multiple possible values with cleaner code than many if-else statements.",
              },
              {
                text: "What does 'else if' do?",
                options: ["Checks a new condition if previous is false", "Ends the program", "Repeats a loop", "Declares a variable"],
                correctAnswer: "Checks a new condition if previous is false",
                explanation:
                  "'else if' lets you check another condition if the first 'if' was false.",
              },
              {
                text: "What will '5 > 3 && 2 < 4' return?",
                options: ["true", "false", "undefined", "error"],
                correctAnswer: "true",
                explanation:
                  "Both conditions are true, so the AND '&&' expression returns true.",
              },
            ],
          },

          // ===================== INTERMEDIATE LEVEL =====================
          {
            stageName: "Loops",
            levelName: "Intermediate",
            questions: [
              {
                text: "Which loop checks the condition before executing the block?",
                options: ["while", "do-while", "for", "foreach"],
                correctAnswer: "while",
                explanation:
                  "'while' checks the condition first; 'do-while' executes once before checking.",
              },
              {
                text: "How do you loop through an array using a for loop?",
                options: ["for(let i=0; i<arr.length; i++)", "for(let i in arr)", "arr.forEach()", "All of the above"],
                correctAnswer: "All of the above",
                explanation:
                  "JavaScript provides multiple ways to iterate through arrays.",
              },
              {
                text: "What does 'break' do inside a loop?",
                options: ["Exits the loop", "Skips to next iteration", "Stops the program", "Throws error"],
                correctAnswer: "Exits the loop",
                explanation:
                  "'break' immediately exits the current loop.",
              },
              {
                text: "What does 'continue' do inside a loop?",
                options: ["Skips current iteration", "Exits loop", "Restarts program", "Throws error"],
                correctAnswer: "Skips current iteration",
                explanation:
                  "'continue' skips to the next iteration without exiting the loop.",
              },
              {
                text: "Which loop is guaranteed to execute at least once?",
                options: ["do-while", "while", "for", "foreach"],
                correctAnswer: "do-while",
                explanation:
                  "'do-while' runs the block first and then checks the condition.",
              },
            ],
          },
          {
            stageName: "Functions",
            levelName: "Intermediate",
            questions: [
              {
                text: "How do you define a function in JavaScript?",
                options: ["function myFunc() {}", "def myFunc() {}", "func myFunc() {}", "lambda myFunc() {}"],
                correctAnswer: "function myFunc() {}",
                explanation:
                  "The 'function' keyword defines a function in JavaScript.",
              },
              {
                text: "What is a callback function?",
                options: ["A function passed as an argument", "A function that returns a value", "A function with no name", "A function that loops"],
                correctAnswer: "A function passed as an argument",
                explanation:
                  "Callbacks are functions passed to other functions to be executed later.",
              },
              {
                text: "Which keyword creates a function expression?",
                options: ["function", "const", "let", "var"],
                correctAnswer: "const",
                explanation:
                  "Function expressions are often stored in constants: const myFunc = function() {}",
              },
              {
                text: "What is an arrow function?",
                options: ["()=>{}", "function(){}", "def(){}", "func(){}"],
                correctAnswer: "()=>{}",
                explanation:
                  "Arrow functions provide a concise syntax for writing functions.",
              },
              {
                text: "How do you call a function named 'myFunc'?",
                options: ["myFunc()", "call myFunc", "run myFunc", "execute myFunc()"],
                correctAnswer: "myFunc()",
                explanation:
                  "You call a function by adding parentheses after its name.",
              },
            ],
          },
          {
            stageName: "Arrays",
            levelName: "Intermediate",
            questions: [
              {
                text: "How do you get the length of an array?",
                options: ["arr.length", "arr.size", "len(arr)", "arr.count"],
                correctAnswer: "arr.length",
                explanation:
                  "The 'length' property gives the number of elements in an array.",
              },
              {
                text: "Which method adds an element to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correctAnswer: "push()",
                explanation:
                  "'push()' appends elements to the end of an array.",
              },
              {
                text: "Which method removes the first element from an array?",
                options: ["shift()", "pop()", "unshift()", "splice()"],
                correctAnswer: "shift()",
                explanation:
                  "'shift()' removes the first element, moving all others down.",
              },
              {
                text: "How do you check if a value exists in an array?",
                options: ["includes()", "contains()", "has()", "exists()"],
                correctAnswer: "includes()",
                explanation:
                  "'includes()' returns true if the array contains the value.",
              },
              {
                text: "How do you merge two arrays?",
                options: ["concat()", "+", "merge()", "combine()"],
                correctAnswer: "concat()",
                explanation:
                  "'concat()' joins two arrays into a new array.",
              },
            ],
          },

          // ===================== ADVANCED LEVEL =====================
          {
            stageName: "Objects",
            levelName: "Advanced",
            questions: [
              {
                text: "How do you create an object in JavaScript?",
                options: ["{}", "[]", "()", "new Object[]"],
                correctAnswer: "{}",
                explanation:
                  "Curly braces define an object literal in JavaScript.",
              },
              {
                text: "How do you access a property 'name' in an object 'obj'?",
                options: ["obj.name", "obj['name']", "Both", "obj->name"],
                correctAnswer: "Both",
                explanation:
                  "You can access properties with dot notation or bracket notation.",
              },
              {
                text: "Which method returns an array of keys of an object?",
                options: ["Object.keys()", "Object.values()", "Object.entries()", "keys()"],
                correctAnswer: "Object.keys()",
                explanation:
                  "Object.keys(obj) returns an array of all property names.",
              },
              {
                text: "What does 'delete obj.prop' do?",
                options: ["Removes the property", "Sets it to null", "Throws error", "Deletes the object"],
                correctAnswer: "Removes the property",
                explanation:
                  "'delete' removes the property from the object.",
              },
              {
                text: "How do you copy an object shallowly?",
                options: ["Object.assign()", "{...obj}", "Both", "JSON.parse()"],
                correctAnswer: "Both",
                explanation:
                  "You can use Object.assign({}, obj) or spread syntax {...obj}.",
              },
            ],
          },
          {
            stageName: "Classes",
            levelName: "Advanced",
            questions: [
              {
                text: "How do you define a class in JavaScript?",
                options: ["class MyClass {}", "function MyClass {}", "def MyClass {}", "class: MyClass {}"],
                correctAnswer: "class MyClass {}",
                explanation:
                  "'class' keyword defines a class in JavaScript.",
              },
              {
                text: "How do you create an instance of a class?",
                options: ["new MyClass()", "MyClass()", "create MyClass()", "MyClass.new()"],
                correctAnswer: "new MyClass()",
                explanation:
                  "'new' keyword creates an instance of a class.",
              },
              {
                text: "What is a constructor?",
                options: ["Special method to initialize objects", "A function that returns", "A variable in class", "A property"],
                correctAnswer: "Special method to initialize objects",
                explanation:
                  "The constructor method initializes new objects when created.",
              },
              {
                text: "Which keyword is used to inherit from a class?",
                options: ["extends", "implements", "inherits", "super"],
                correctAnswer: "extends",
                explanation:
                  "'extends' allows one class to inherit properties and methods from another.",
              },
              {
                text: "How do you call a parent class method?",
                options: ["super.method()", "parent.method()", "this.method()", "base.method()"],
                correctAnswer: "super.method()",
                explanation:
                  "'super' is used to call a method from the parent class.",
              },
            ],
          },
          {
            stageName: "Async & Promises",
            levelName: "Advanced",
            questions: [
              {
                text: "What does a Promise represent?",
                options: ["Future value", "Current value", "Function", "Variable"],
                correctAnswer: "Future value",
                explanation:
                  "A Promise represents a value that may be available in the future.",
              },
              {
                text: "Which method handles a resolved Promise?",
                options: ["then()", "catch()", "finally()", "resolve()"],
                correctAnswer: "then()",
                explanation:
                  "then() executes code when a Promise is fulfilled.",
              },
              {
                text: "Which method handles a rejected Promise?",
                options: ["catch()", "then()", "finally()", "reject()"],
                correctAnswer: "catch()",
                explanation:
                  "catch() handles errors when a Promise is rejected.",
              },
              {
                text: "What does 'async' before a function do?",
                options: ["Makes it return a Promise", "Makes it synchronous", "Blocks execution", "Throws error"],
                correctAnswer: "Makes it return a Promise",
                explanation:
                  "'async' functions always return a Promise, even if you return a value directly.",
              },
              {
                text: "Which keyword is used to wait for a Promise?",
                options: ["await", "then", "async", "yield"],
                correctAnswer: "await",
                explanation:
                  "'await' pauses async function execution until the Promise resolves.",
              },
            ],
          },
        ],
      },
    ];


    // Save questions to DB

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
            explanation: q.explanation, 
          });
        }

        console.log(`Added ${stageSet.questions.length} questions for ${stage.name}`);
      }
    }

    console.log("🎉 All questions seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedQuestions();
