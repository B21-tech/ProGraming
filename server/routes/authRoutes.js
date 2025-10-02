// API ENDPOINT
import express from "express"
import { completeOnboarding, isAuthenticated, login, logout, register, resendUserOtp, resetPassWord, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

// creating a router 
const authRouter = express.Router();

// register and login
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

//user authentication 
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);

// reset opt password
authRouter.post('/resend-otp', resendUserOtp);
authRouter.post('/reset-password', resetPassWord);

// onboarding process
authRouter.post("/onboarding", userAuth, completeOnboarding)

export default authRouter;