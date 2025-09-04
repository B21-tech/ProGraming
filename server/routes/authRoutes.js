import express from "express"
import { login, logout, register, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

// creating a router 
const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-top', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);

export default authRouter;