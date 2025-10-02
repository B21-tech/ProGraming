//creating a controller function
import userModel from "../models/userModel.js";

export const getUserData = async (req, res)=>{
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        // check if the user exists or not 
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }

        // if the user does exist 
        res.json({
            success: true,
            getUserData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (error) {
        return res.json({sucess: false, message: error.message});
    }
}