// creating different controller functions and authentification 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import nodemailer from 'nodemailer/lib/xoauth2/index.js';

const { JsonWebTokenError } = jwt;
// register verification
export const register = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: "Missing Details" });
    }

    try {
        // Check existing user
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email)
                return res.status(409).json({ success: false, message: "A user already exists with this email" });
            if (existingUser.username === username)
                return res.status(409).json({ success: false, message: "Username already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DB
        const user = new userModel({
            email,
            username,
            password: hashedPassword,
            onboardingComplete: false,
            selectedLanguage: null,
            progress: {}
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpire = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        // Send email
        const mailOption = {
            from: '"ProGaming Support" <no.reply.progaming@gmail.com>',
            to: user.email,
            subject: 'Verify Your ProGaming Account',
            text: `Welcome ${username}! Your verification OTP is: ${otp}`
        };
        await transporter.sendMail(mailOption);

        // ✅ Send proper success response
        return res.status(200).json({
            success: true,
            message: "Signup successful! OTP has been sent to your email.",
            onboardingRequired: true
        });

    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ success: false, message: "Signup failed. " + error.message });
    }
};


// User login validation 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userCourseId = user.selectedLanguage; 

    // ✅ Send OnboardingComplete field
    return res.status(200).json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
        OnboardingComplete: user.OnboardingComplete,
        selectedLanguage: user.selectedLanguage,
        selectedCourseId: userCourseId,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Code for user to verify their account 
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user)
            return res.json({ success: false, message: "User not found" });

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" })
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
            from: '"ProGaming Support" <no.reply.progaming@gmail.com>',
            to: user.email,
            subject: 'Account Verification OTP',
            text: 'Your OTP is ' + otp + '. Please verify your account using this OTP. Do not share with anyone else.'
        }
        await transporter.sendMail(mailOption);

        res.json({ success: true, message: "Verification OTP Sent on email" });
    } catch (error) {
        res.json({ success: false, message: error.message });
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


// Using otp to verify a user that has signed up 
export const verifyEmail = async (req, res) => {
    // user id and OTP
    const { otp } = req.body;
    const userId = req.userId;

    if (!userId || !otp) {
        // returning a response 
        return res.json({ success: false, message: 'Missing Details' });
    }
    try {
        // finding the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        // if OTP is expired 
        if (user.verifyOtpExpire < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        // verify the users account
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpire = 0;

        await user.save();
        return res.json({ success: true, message: "Email verified successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// check If a user is authenticated or not 
export const isAuthenticated = async (req, res) => {
    try {
        // whenever the user is suthenticated
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

// Resend the OTP to user 
export const resendUserOtp = async (req, res) => {
    const { email } = req.body;
    // if user did not provide their email
    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }

    try {
        // finding the user using their email
        const user = await userModel.findOne({ email });

        // if the user does not match with the email
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        // generating a six digit number for verification
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        // expiry time is now 15 minutes
        user.resetOtpExpire = Date.now() + 15 * 60 * 60 * 1000

        // saving the property value 
        await user.save();
        const mailOption = {
            from: '"ProGaming Support" <no.reply.progaming@gmail.com>',
            to: user.email,
            subject: 'Password Reset OTP',
            text: 'Your resetted OTP is ' + otp + '. Please use this OTP to change your password. Do not share with anyone else.'
        }
        await transporter.sendMail(mailOption);

        return res.json({ success: true, message: 'The OTP has been sent to your email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// verify otp and reset password 
export const resetPassWord = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    // if the email is not available 
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        // if the email was not provided 
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        // IF OTP is stored in the database 
        if (user.resetOtpExpire < Date.now()) {
            // this means the otp is already expired 
            return res.json({ success: false, message: 'OTP is expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update the password to the users database 
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpire = 0;

        await user.save();

        return res.json({ success: true, message: "Password has bee changed successfully" });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// complete onboarding process
export const completeOnboarding = async (req, res) => {
    try {
        const userId = req.userId;
        const { selectedLanguage } = req.body;

        if (!selectedLanguage) {
            return res.status(400).json({ success: false, message: "Language must be selected" });
        }

        // Fetch user from DB
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent repeating onboarding
        if (user.OnboardingComplete) {
            return res.status(400).json({ success: false, message: "Onboarding already completed" });
        }

        // Update user document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            {
                selectedLanguage,
                OnboardingComplete: true, // ✅ correct casing
                progress: { [selectedLanguage]: { level: 1, completed: [] } }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Onboarding completed",
            user: updatedUser
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

