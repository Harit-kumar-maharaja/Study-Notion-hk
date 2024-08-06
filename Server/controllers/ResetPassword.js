const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//reset password token
exports.resetPasswordToken = async (req, res) => {

    try {

        //get email from body
        const email = req.body.email;

        //check user for email , email validation
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({
                success: false,
                message: 'Your email is not registered',
            })
        }

        //generate token
        const token = crypto.randomUUID();

        //update user by adding oken and expiration times
        const updatedDetails = await User.findOneAndUpdate({ email: email }, { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000, }, { new: true })

        //create URL
        const url = `http://localhost:3000/update-password/${token}`

        //send mail containg url
        await mailSender(email, "Password Reset Link ", `Password reset link : ${url}`);

        //return response
        return res.json({
            success: true,
            message: 'Email Sent successfully ',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}

//reset password

exports.resetPassword = async (req , res) => {
    
    try {

        //data fetch
    const {password , confirmPassword , token} = req.body;

    //validation
    if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"Password is not matching",
        })
    }

    //get user dfetails from db using token
    const userDetails = await User.findOne({token:token});

    //if no entry - invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:'Token is invalid',
        })
    }

    //token time check
    if(userDetails.resetPasswordExpires < Date.now()){
        return res.json({
            success:false,
            message:'Token is expired , please regenerate your token',
        })
    }

    //hash pwd
    const hashPassword = await bcrypt.hash(password , 10);

    //password update
    await User.findOneAndUpdate(
        {token:token},
        {password:hashPassword},
        {new:true},
    )

    //return password
    return res.status(200).json({
        success:true,
        message:'Password reset successfull',
    })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })              
    }
}