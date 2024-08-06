const Profile = require("../models/Profile");
const User = require("../models/User")

exports.updateProfile = async (req, res) => {
    try {

        //get data
        const {dateOfBirth = "" , about = "" , contactNumber , gender} = req.body;

        //get userId
        const id = req.user.id;

        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        
        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated successfully',
            profileDetails,
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//delete account
exports.deleteAccount = async (req , res) => {
    try {

        //get id
        const id = req.user.id;

        //validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:'User not found',
            });
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //delete user
        await User.findByIdAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message:'Account deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })       
    }
}

//get user all details
exports.getAllUserDetails = async (req , res) => {
    try {

        const id = req.user.id;

        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            userDetails,
            message:'User data fetched successfully',
        }); 
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })                     
    }
}

//get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("enrolledCourses").exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            enrolledCourses: userDetails.enrolledCourses,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
        });
    }
}


// updatedisplaypicture

