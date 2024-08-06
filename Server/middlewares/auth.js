const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User")

//auth
exports.auth = async (req , res , next) => {
    try {

        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer" , "");

        // if token missing
        if(!token){
            return res.status(401).res({
                success:false,
                message:'Token is missing',
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            //verification issue
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        })
    }
}

//isstudent
exports.isStudent = async (req , res , next) => {
    try {

        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:'Protected route for students only', 
            })
        }

        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"User role cannot be verified",
        })
    }
}

//isinstructor
exports.isInstructor = async (req , res , next) => {
    try {

        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:'Protected route for Instructor only', 
            })
        }
        
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:error.message,
        })
    }
}

//isadmin
exports.isAdmin = async (req , res , next) => {
    try {

        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'Protected route for Admin only', 
            })
        }
        
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:error.message,
        })
    }
}