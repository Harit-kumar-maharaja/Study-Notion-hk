const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 50 * 60, // Expires in 50 minutes
    }
});

// Create a transporter for Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Verification Email from Stydynotion",
            text: `Your OTP is ${otp}`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", mailResponse);
        
    } catch (error) {
        console.log("Error occurred while sending email", error);
        throw error;
    }
}

OTPSchema.pre("save", async function (next) {
    if (this.isNew) { // Only send email if it's a new OTP
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);
