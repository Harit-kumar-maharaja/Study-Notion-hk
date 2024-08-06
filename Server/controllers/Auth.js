const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const profile = require("../models/Profile")
require("dotenv").config();
const nodemailer = require("nodemailer");

//sendotp
exports.sendOTP = async (req, res) => {

    try {
        //fetch email
        const { email } = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({ email });

        //if user already exist , then return a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User aalready present",
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated : ", otp);

        //check unique otp or not
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayLoad = {email , otp};

        // Add this after OTP creation
        const otpBody = await OTP.create(otpPayLoad);
        console.log('OTP created:', otpBody); // This should show the OTP document


        //return response succesfull
        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//signup
exports.signUp = async (req , res) => {
    try {

        //data fetch fom body

    const {firstName , lastName , email , password , confirmPassword , accountType ,contactNumber , otp} = req.body;

    //validate kro
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
        return res.status(403).json({
            success:false,
            message:'All fields are required',
        })
    }

    //2 password match kro
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:'Password and confirmpassword value does not march',
        });
    }

    //check user already exist or not
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:'User is already registered',
        });
    }

    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
        console.log('Retrieved OTP from DB:', recentOtp);

    //validate otp
    if(!recentOtp){
        //otp not found
        return res.status(400).json({
            success:false,
            message:'OTP not found',
        });
    }else if(otp !== recentOtp.otp ){
        //invalid otp
        return res.status(400).json({
            success:false,
            message:'Invalid Otp',
        });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password , 10);
    
    //entry in db

    const profileDetails = await profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
    })

    //return res
    return res.status(200).json({
        success:true,
        message:'User successfully craeted',
        user,
    })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// login
exports.login = async (req , res) => {
    try {

        //get data from body
        const {email , password} = req.body;

        //validate the data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            });
        }

        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered please signup first",
            });
        }

        //generate jwt token after password matching
        if(await bcrypt.compare(password , user.password)){
            const token = jwt.sign({email:user.email, id:user._id, accountType : user.accountType } , process.env.JWT_SECRET , {
                expiresIn:"24h",
            });
            user.token = token;
            user.password = undefined;

            //craete cookie and send response
            const options= {
                expires:new Date(Date.now() + 3*24*60*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token" , token , options ).status(200).json({
                success:true,
                token ,
                user,
                message:'Logged in successfully',
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


// Function to send password change email
const sendPasswordChangeEmail = async (email) => {
    try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password
            },
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Changed Successfully",
            text: "Your password has been updated successfully.",
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log("Password change email sent successfully");
    } catch (error) {
        console.log("Error sending password change email:", error);
    }
};

// changepassword
exports.changePassword = async (req , res) => {

    try {

    //get data from req body 
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    //get oldPassword , newPassword , confirmPassword
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Check if newPassword matches confirmPassword
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "New password and confirm password do not match",
        });
    }

    // Get user ID from request (assuming user ID is stored in req.user.id)
    const userId = req.user.id;

    const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

    // Check if the old password matches the stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Old password is incorrect",
        });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in the database
    User.password = hashedPassword;
    await User.save();

    // Send email notification
    await sendPasswordChangeEmail(user.email);

    // return response
    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Password change failed, please try again",
        });       
    }
}