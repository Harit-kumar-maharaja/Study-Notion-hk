const Course = require("../models/Course")
const User = require("../models/User")
const Category = require("../models/Category")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();

//create course handler function 
exports.createCourse = async (req , res) => {
    try {

        //fetch data
        const {courseName , courseDescription , whatYouWillLearn , price , category} = req.body;

        //get thumbnail
        const thumbnail = req.files?.thumbnailImages;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn ||!price || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor details : " , instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor details not found",
            });
        }

        //check if given Category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category details not found",
            });
        }

        //upload to the cloudinary
        const thumbnailImages = await uploadImageToCloudinary(thumbnail , process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImages.secure_url,
        })

        //add the new course to the user schema of the instructor
        await User.findByIdAndUpdate(
            
                instructorDetails._id,
            
            {
                $push: {
                    courses:newCourse._id,
                }
            },
            {new:true},
        )

        //update the Category ka schema
        await Category.findByIdAndUpdate(
            category,
            {
                $push: { courses: newCourse._id },
            },
            { new: true }
        );

        //return response
        return res.status(200).json({
            success:true,
            message:'Course Created Successfully',
            data:newCourse,
        });
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:error.message,
        })          
    }
}


//get all courses handler function
 
exports.getAllCourses = async (req , res) => {
    try{

        const allCourses = await Course.find({} , {courseName : true,
                                                    price:true,
                                                    thumbnail:true,
                                                    instructor:true,
                                                    ratingAndReviews:true,
                                                    studentsEnrolled:true,})
                                                    .populate("instructor")
                                                    .exec();

        return res.status(200).json({
            success:true,
            message:'Data of al courses fetched succesfully',
            data:allCourses,
        })
    }
    catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })          
    }
}

//get courses details
exports.getCourseDetails = async (req , res) => {
    try {
        //get id 
        const {courseId} = req.body;
        ///find course details
        const courseDetails  = await Course.findById(courseId)
                                                .populate(
                                                    {
                                                        path:"instructor",
                                                        populate:{
                                                            path:"additionalDetails",
                                                        }
                                                    }
                                                )
                                                .populate("category")
                                                // .populate("ratingAndReviews")
                                                .populate({
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection",
                                                    }
                                                })
                                                .exec();

        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });
        }

        //return response
        return res.status(200).json({
            success:true,
            message:'course details fetched successfully ',
            courseDetails,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}