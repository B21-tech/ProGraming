// creating different controller functions and authentification 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

const { JsonWebTokenError } = jwt;
// register verification
export const register = async (req, res) => {
    const { name, email, username, password } = req.body;
    if (!name || !email || !password || !username) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {
        // check existing user using their email or username
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.json({ success: false, message: "A user already exists with this email" });
            }
            if (existingUser.username === username) {
                return res.json({ success: false, message: "Username already exists" });
            }
        }

        // protecting password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user for the database 
        const user = new userModel({name, email, username, password:hashedPassword
        })
        // save user to Mongoose database or user model 
        await user.save();

        // generating tokens and idsfor cookies 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ?
                'none' : 'strict',
            // expiry time for the cookie
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending the email to the user 
        const mailOptions = {
            from: "ProGaming" + process.env.SENDER_EMAIL,
            // get email from the request body
            to: email,
            subject: 'Welcome to ProGaming!',
            text: "Welcome to ProGaming, your account has been created with email id: " +email
        }
        // sending the email to the user
        await transporter.sendMail(mailOptions);

        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// User login validation 
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" })
    }

    try {
        const user = await userModel.findOne({ email});

        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" })
        }
        // password varification
        const isMatch = await bcrypt.compare(password, user.password);

        // if  password does not match
        if (!isMatch) {
            return res.json({ sucess: false, message: "Invalid email or password" });
        }

        // generating tokens and ids for cookies 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ?
                'none' : 'strict',
            // expiry time for the cookie
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({ success: true });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Code for user to verify their account 
export const sendVerifyOtp = async (req, res)=>{
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return json({success: flase, message: "Account already verified"})
        }
        // generating a six digit number for verification
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // adding otp to database 
        user.verifyOtp = otp;

        // expiry time 
        user.verifyOtpExpire = Date.now() + 24 * 60 * 60 * 1000

        // saving the property value 
        await user.save();
        const mailOption = {
            from: "ProGaming" + process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: 'Your OTP is ' + otp + 'please verify your account using this OTP. Do not share with anyone else.'
        }
        await transporter.sendMail(mailOption);

        res.json({success: true, message: "Verification OTP Sent on email"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// logout function
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ?
                'none' : 'strict',
        })
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) =>{
    // user id and OTP
    const {userId, otp} = req.body;

    if(!userId || !otp){
        // returning a response 
        return res.json({success: false, message: 'Missing Details'});
    }
    try {
        // finding the user
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'Invalid OTP'});
        }

        // if OTP is expired 
        if(user.verifyOtpExpire < Date.now()){
            return res.json({success: false, message: 'OTP expired'});
        }

        // verify the users account
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpire = 0;

        await user.save();
        return res.json({success: true, message: "Email verified successfully"})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
