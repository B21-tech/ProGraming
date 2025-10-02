// function that will find the token from the cookie 
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next)=>{
    // get token from cookie
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: "Not Authorized. Login Again"})
    }

    try {
        // decoding the token
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecoded.id){
           req.userId = tokenDecoded.id 
        }
        else{
            return res.json({success: false, message: 'Not Authorized. Please login again'});
        }
        next();
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export default userAuth;