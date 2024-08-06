const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course")

//creating rating
exports.createRating = async (req , res) => {
    try {

        //get user id
        const userId = req.user.id;

        // fetch data from req body
        const {rating , review , courseId} = req.body;

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                                    {_id:courseId , 
                                                        studentsEnrolled:{$elemMatch : {$eq:userId}},
                                                    }
        );

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in this course',
            });
        }

        //check if user already reviewd the course
        const alreadyReviewed = await RatingAndReviews.findOne({
                                                                user:userId,
                                                                course:courseId,
        });

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by user',
            })
        }

        //create rating nd review
        const ratingReview = await RatingAndReviews.create({
            rating , review , course:courseId , user:userId,
        })

        //update course with the rating and review
        const updateCourseDetails = await Course.findByIdAndUpdate({_id:courseId} , 
                                        {
                                            $push:{
                                                ratingAndReviews:ratingReview._id,
                                            }
                                        },
                                        {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:'Rating and review created successfully',
            ratingReview,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//get average rating
exports.getAverageRating = async (req , res) => {
    try {

        //get course id
        const courseId = req.body.courseId;

        //calculate average
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg : "$rating"},
                }
            },
        ])

        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        //if no rating review exist
        return res.status(200).json({
            success:true,
            message:'Average rating is 0 , no rating given till now',
            averageRating: 0,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// get all rating
exports.getAllRating = async (req , res) => {
    try {

        const allReviews = await RatingAndReviews.find({})
                                                .sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image",
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName",
                                                })
                                                .exec()
        // return response
        return res.status(200).json({
            success:true,
            message:'All reviews fetched successfully',
            data:allReviews,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}