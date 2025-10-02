import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';

// retrieving user data
const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

// exporting the router 
export default userRouter;