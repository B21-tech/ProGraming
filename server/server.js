import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"; 

import "./models/index.js";

import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";

// Course routes 
import questionRoutes from "./routes/questionRoutes.js";
import stageRoutes from "./routes/stageRoutes.js";

// user progress routes
import progressRoutes from "./routes/progressRoutes.js";

const app = express();
const port= process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// API routes
app.use('/api/authorize', authRouter);
app.use('/api/user', userRouter);

app.use("/api", authRouter);

// stageRoutes.js
app.use('/api/stages', stageRoutes);

// user progress routes
app.use("/api/progress", progressRoutes);

// Neww
app.use("/api/leaderboard", progressRoutes);

// generate questions for the users
app.use('/api/questions', questionRoutes);

app.get('/', (req, res)=> res.send("API working"));

app.listen(port, ()=> console.log('Server started on port: '+ port));

