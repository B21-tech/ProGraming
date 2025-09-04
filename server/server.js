import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"; 

import connectDB from './config/mongodb.js';
// importing router 
import authRouter from './routes/authRoutes.js';


const app = express();
// port number 
const port= process.env.PORT || 4000;

// calling function 
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true}));

// API endpoint
app.get('/', (req, res)=> res.send("API working"));
app.use('/api/ProGraming', authRouter);

// printing message on terminal
app.listen(port, ()=> console.log('Sever started on port: '+ port));
