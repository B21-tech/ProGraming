//user model for database 
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // adding properties for the table
    name: {type: String, required: true},//name is required
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    // verify user
    verifyOtp: {type: String, default: ""},
    //expiry time for verification 
    verifyOtpExpire: {type: Number, default: 0},
    // property to define if user is verified
    isAccountVerified: {type: Boolean, default: false},// unverified by default
    resetOtp: {type: String, default: ''},
    resetOtpExpire: {type: Number, default: 0},
});

// creating user model 
const userModel = mongoose.models.User || mongoose.model('User', userSchema);

// export user model function from this file 
export default userModel;