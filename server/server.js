import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"; 

import connectDB from './config/mongodb.js';
// importing router 
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoutes.js";



const app = express();
// port number 
const port= process.env.PORT || 4000;

// calling function 
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

// cors 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// API endpoint
app.get('/', (req, res)=> res.send("API working"));
app.use('/api/authorize', authRouter);
app.use('/api/user', userRouter);

// API endpoint
app.get('/', (req, res)=> res.send("API working"));
app.use('/api/ProGraming', authRouter);


// verify user (otp number)
app.use('/api/ProGraming', authRouter);
// printing message on terminal
app.listen(port, ()=> console.log('Sever started on port: '+ port));
